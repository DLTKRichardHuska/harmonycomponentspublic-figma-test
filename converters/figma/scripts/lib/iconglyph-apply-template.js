/**
 * Shared Figma Plugin API body for Icons-library apply batches.
 * Placeholders: __SVGS_JSON__  __TEXT_PRIMARY_ID__  __PAGE_NAME__  __MASTER_NAME__
 *
 * Locked algorithm:
 * - Create/update **standalone** components on the Icons page (name = shadcn id)
 * - outlineStroke → Group + text-primary bind + SCALE in the same pass
 * - never recreate the whole library; update-in-place when name exists
 * - Target file = shared Icons library (external.config.json → iconsLibrary.fileKey)
 */
export const ICONGLYPH_APPLY_TEMPLATE = `const svgs = __SVGS_JSON__;
const TEXT_PRIMARY_ID = __TEXT_PRIMARY_ID__;
const PAGE_NAME = __PAGE_NAME__;
const MASTER_NAME = __MASTER_NAME__;
const page = figma.root.children.find(p => p.name === PAGE_NAME) || figma.root.children[0];
await figma.setCurrentPageAsync(page);
const textPrimary = TEXT_PRIMARY_ID
  ? await figma.variables.getVariableByIdAsync(TEXT_PRIMARY_ID)
  : null;
const gap = 8, cell = 24;
const created = [], errors = [], mutatedNodeIds = [];
function findComponentByName(name) {
  return page.findOne(n => n.type === 'COMPONENT' && n.name === name);
}
function bindFill(node) {
  if (!('fills' in node)) return;
  if (textPrimary) {
    node.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0.22, g: 0.25, b: 0.31 } }, 'color', textPrimary)];
  } else {
    node.fills = [{ type: 'SOLID', color: { r: 0.22, g: 0.25, b: 0.31 } }];
  }
  if ('strokes' in node) node.strokes = [];
  if ('constraints' in node) node.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
}
function remediateClone(comp) {
  let frame = null;
  for (const child of [...comp.children]) {
    if (child.type === 'FRAME' || child.type === 'GROUP') { frame = child; break; }
  }
  const searchRoot = frame || comp;
  for (const vector of searchRoot.findAll(n => n.type === 'VECTOR' && n.strokes && n.strokes.length > 0)) {
    const outlined = vector.outlineStroke && vector.outlineStroke();
    if (!outlined) continue;
    outlined.x = vector.x; outlined.y = vector.y;
    vector.parent.appendChild(outlined); vector.remove();
  }
  const geoTypes = { VECTOR:1, BOOLEAN_OPERATION:1, ELLIPSE:1, RECTANGLE:1, POLYGON:1, STAR:1, LINE:1, GROUP:1 };
  if (frame) {
    while (frame.children.length) {
      const c = frame.children[0];
      if (geoTypes[c.type]) comp.appendChild(c); else c.remove();
    }
    frame.remove();
  }
  function gather(node, leaves) {
    if (node.type === 'GROUP') { for (const ch of [...node.children]) gather(ch, leaves); }
    else if (geoTypes[node.type]) leaves.push(node);
  }
  let leaves = [];
  for (const ch of [...comp.children]) gather(ch, leaves);
  for (const leaf of leaves) { if (leaf.parent !== comp) comp.appendChild(leaf); }
  for (const ch of [...comp.children]) {
    if (ch.type === 'GROUP') {
      while (ch.children && ch.children.length) comp.appendChild(ch.children[0]);
      ch.remove();
    }
  }
  leaves = [...comp.children].filter(c => geoTypes[c.type] && c.type !== 'GROUP');
  if (!leaves.length) return { ok:false, error:'no geometry' };
  for (const g of leaves) bindFill(g);
  const group = figma.group(leaves, comp);
  group.name = 'Group';
  const vectors = group.findAll(n => n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION' || n.type === 'ELLIPSE' || n.type === 'RECTANGLE' || n.type === 'POLYGON');
  for (const v of vectors) {
    bindFill(v);
    if (vectors.length === 1 && v.type === 'VECTOR') v.name = 'Vector (Stroke)';
  }
  return { ok:true, groupId: group.id, vectorCount: vectors.length };
}
const existing = page.findAll(n => n.type === 'COMPONENT');
let i = existing.length;
const master = findComponentByName(MASTER_NAME);
for (const [name, svg] of Object.entries(svgs)) {
  const prior = findComponentByName(name);
  if (prior) { created.push({ name, id: prior.id, skipped:true }); continue; }
  try {
    let comp;
    if (master) {
      comp = master.clone();
      comp.name = name;
      for (const ch of [...comp.children]) ch.remove();
      page.appendChild(comp);
    } else {
      comp = figma.createComponent();
      comp.name = name;
      page.appendChild(comp);
    }
    const imported = figma.createNodeFromSvg(svg);
    imported.name = 'Frame';
    try { imported.resize(24, 24); } catch (e) {}
    comp.appendChild(imported);
    comp.resize(24, 24);
    const result = remediateClone(comp);
    if (!result.ok) {
      comp.remove();
      errors.push({ name, message: result.error });
      continue;
    }
    comp.x = (i % 8) * (cell + gap);
    comp.y = Math.floor(i / 8) * (cell + gap);
    created.push({ name, id: comp.id, vectorCount: result.vectorCount });
    mutatedNodeIds.push(comp.id, result.groupId);
    i++;
  } catch (e) { errors.push({ name, message: String(e && e.message ? e.message : e) }); }
}
return {
  createdNodeIds: created.filter(c => c.id && !c.skipped).map(c => c.id),
  mutatedNodeIds,
  created,
  errors,
  totalComponents: page.findAll(n => n.type === 'COMPONENT').length
};
`;

/**
 * @param {Record<string, string>} svgs
 * @param {{ textPrimaryId?: string, pageName?: string, masterName?: string }} [opts]
 */
export function buildApplyCode(svgs, opts = {}) {
  const textPrimaryId = opts.textPrimaryId || '';
  const pageName = opts.pageName || 'Icons';
  const masterName = opts.masterName || 'plus';
  return ICONGLYPH_APPLY_TEMPLATE
    .replace('__SVGS_JSON__', JSON.stringify(svgs))
    .replace('__TEXT_PRIMARY_ID__', JSON.stringify(textPrimaryId))
    .replace('__PAGE_NAME__', JSON.stringify(pageName))
    .replace('__MASTER_NAME__', JSON.stringify(masterName));
}

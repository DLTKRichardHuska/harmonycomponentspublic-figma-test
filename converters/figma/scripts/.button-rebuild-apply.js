// Figma Plugin API — Button set rebuild (update-in-place 6:2). Run via use_figma.
const SET_ID = '6:2';
const ICON_SET_ID = '44:28';
const VARIANTS = ['primary','secondary','tertiary','outline','ghost','destructive','dela','dela-pill'];
const SIZES = ['xs','sm','md','lg'];
const STATES = ['default','hover','focus'];
const HEIGHT = { xs:24, sm:32, md:40, lg:48 };
const PAD_X = { xs:8, sm:12, md:16, lg:24 };
const GAP = { xs:4, sm:6, md:8, lg:8 };
const TEXT_STYLE = {
  xs: 'Typography/Button/xs',
  sm: 'Typography/Button/sm',
  md: 'Typography/Button/md',
  lg: 'Typography/Button/lg',
};

function hex(h) {
  const n = parseInt(h.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

async function varMap() {
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const color = cols.find((c) => c.name === 'Color');
  const map = {};
  for (const id of color.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    map[v.name] = v;
  }
  return map;
}

function boundFill(variable) {
  return figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
    'FILL',
    variable
  );
}

function boundStroke(variable) {
  return figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
    'STROKE',
    variable
  );
}

function paintsFor(variant, state, buttonType, vars, delaStyle) {
  const isPH = buttonType === 'pageHeader' && !variant.startsWith('dela');
  let fills = [];
  let strokes = [];
  let strokeWeight = 0;
  let textVar = vars['primary-foreground'];
  let radius = 8;

  if (variant === 'primary') {
    if (isPH) {
      fills = [boundFill(state === 'hover' ? vars['page-header-btn-primary-hover'] : vars['page-header-btn-primary'])];
      textVar = vars['page-header-btn-primary-fg'];
    } else {
      fills = [boundFill(state === 'hover' ? vars['primary-hover'] : vars.primary)];
      textVar = vars['primary-foreground'];
    }
  } else if (variant === 'secondary') {
    fills = [boundFill(state === 'hover' ? (isPH ? vars['page-header-btn-secondary-hover-bg'] : vars['theme-btn-secondary-hover-bg']) : vars['elevated-bg'])];
    const strokeV = isPH
      ? (state === 'hover' ? vars['page-header-btn-secondary-stroke'] : vars['page-header-btn-secondary-stroke'])
      : (state === 'hover' ? vars['theme-btn-secondary-hover-stroke'] : vars['theme-btn-secondary-stroke']);
    strokes = [boundStroke(strokeV)];
    strokeWeight = 1;
    textVar = isPH
      ? vars['page-header-btn-secondary-default-fg']
      : (state === 'hover' ? vars['theme-btn-secondary-hover-fg'] : vars['theme-btn-secondary-stroke']);
  } else if (variant === 'tertiary') {
    if (state === 'hover') {
      fills = [boundFill(isPH ? vars['page-header-btn-tertiary-hover-bg'] : vars['theme-btn-tertiary-hover-bg'])];
    } else {
      fills = [];
    }
    textVar = isPH ? vars['page-header-btn-tertiary-fg'] : vars['theme-btn-tertiary-fg'];
  } else if (variant === 'outline') {
    fills = state === 'hover' ? [boundFill(vars['hover-bg'])] : [];
    strokes = [boundStroke(vars['border-color'])];
    strokeWeight = 1;
    textVar = vars['text-primary'];
  } else if (variant === 'ghost') {
    fills = state === 'hover' ? [boundFill(vars['hover-bg'])] : [];
    textVar = vars['text-primary'];
  } else if (variant === 'destructive') {
    fills = [boundFill(vars.error)];
    textVar = vars['primary-foreground'];
  } else if (variant === 'dela' || variant === 'dela-pill') {
    radius = variant === 'dela-pill' ? 999 : 2;
    fills = delaStyle ? delaStyle.paints.map((p) => JSON.parse(JSON.stringify(p))) : [boundFill(vars.primary)];
    textVar = vars['dela-foreground'];
  }

  // focus ring approximation: stroke card-bg + primary already distinct via state label
  if (state === 'focus' && variant !== 'dela' && variant !== 'dela-pill') {
    if (!strokes.length) {
      strokes = [boundStroke(vars['card-bg'])];
      strokeWeight = 1;
    }
  }

  return { fills, strokes, strokeWeight, textVar, radius };
}

async function buildMaster(vars, delaStyle, iconDefault, textStyles) {
  const root = figma.createComponent();
  root.name = 'template';
  root.layoutMode = 'HORIZONTAL';
  root.primaryAxisAlignItems = 'CENTER';
  root.counterAxisAlignItems = 'CENTER';
  root.primaryAxisSizingMode = 'AUTO';
  root.counterAxisSizingMode = 'FIXED';
  root.paddingLeft = PAD_X.md;
  root.paddingRight = PAD_X.md;
  root.itemSpacing = GAP.md;
  root.resize(80, HEIGHT.md);
  root.cornerRadius = 8;

  // content group
  const content = figma.createFrame();
  content.name = 'content';
  content.layoutMode = 'HORIZONTAL';
  content.primaryAxisAlignItems = 'CENTER';
  content.counterAxisAlignItems = 'CENTER';
  content.primaryAxisSizingMode = 'AUTO';
  content.counterAxisSizingMode = 'AUTO';
  content.itemSpacing = GAP.md;
  content.fills = [];
  root.appendChild(content);

  const icon = iconDefault.createInstance();
  icon.name = 'icon';
  icon.rescale(16 / Math.max(icon.width, 1));
  content.appendChild(icon);

  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  const label = figma.createText();
  label.name = 'label';
  label.characters = 'Button';
  const ts = textStyles[TEXT_STYLE.md];
  if (ts) label.textStyleId = ts.id;
  content.appendChild(label);

  // loading group
  const loading = figma.createFrame();
  loading.name = 'loading';
  loading.layoutMode = 'HORIZONTAL';
  loading.primaryAxisAlignItems = 'CENTER';
  loading.counterAxisAlignItems = 'CENTER';
  loading.primaryAxisSizingMode = 'AUTO';
  loading.counterAxisSizingMode = 'AUTO';
  loading.itemSpacing = 6;
  loading.fills = [];
  loading.visible = false;
  root.appendChild(loading);

  const spinner = figma.createEllipse();
  spinner.name = 'spinner';
  spinner.resize(14, 14);
  spinner.fills = [];
  spinner.strokes = [boundStroke(vars['primary-foreground'])];
  spinner.strokeWeight = 2;
  spinner.arcData = { startingAngle: 0, endingAngle: Math.PI * 1.5, innerRadius: 0 };
  loading.appendChild(spinner);

  const loadingText = figma.createText();
  loadingText.name = 'loadingText';
  loadingText.characters = 'Loading…';
  if (ts) loadingText.textStyleId = ts.id;
  loading.appendChild(loadingText);

  // disabled overlay
  const dim = figma.createRectangle();
  dim.name = 'disabledOverlay';
  dim.resize(10, 10);
  dim.fills = [{ type: 'SOLID', color: hex('#ffffff'), opacity: 0.4 }];
  dim.visible = false;
  dim.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
  root.appendChild(dim);
  dim.layoutPositioning = 'ABSOLUTE';
  dim.x = 0;
  dim.y = 0;
  dim.resize(root.width, root.height);

  return { root, content, icon, label, loading, loadingText, spinner, dim };
}

async function main() {
  const buttonsPage = figma.root.children.find((p) => p.name === 'Components / Buttons');
  if (!buttonsPage) throw new Error('Components / Buttons page missing');
  await figma.setCurrentPageAsync(buttonsPage);

  const set = await figma.getNodeByIdAsync(SET_ID);
  if (!set || set.type !== 'COMPONENT_SET') throw new Error('Button set missing');

  const vars = await varMap();
  const paints = await figma.getLocalPaintStylesAsync();
  const delaStyle = paints.find((p) => p.name === 'Dela/gradient');
  const textStylesArr = await figma.getLocalTextStylesAsync();
  const textStyles = Object.fromEntries(textStylesArr.map((s) => [s.name, s]));
  const iconSet = await figma.getNodeByIdAsync(ICON_SET_ID);
  const iconDefault = iconSet.defaultVariant;

  // Remove existing children (keep set id)
  const old = [...set.children];
  for (const ch of old) ch.remove();

  // Build master once, then clone
  const { root: master } = await buildMaster(vars, delaStyle, iconDefault, textStyles);
  // Place master off-canvas on the set's page for cloning
  const hostPage = figma.currentPage;
  hostPage.appendChild(master);
  master.x = -2000;
  master.y = -2000;

  const created = [];
  const CELL_W = 120;
  const CELL_H = 64;
  const GAP_X = 16;
  const GAP_Y = 16;

  for (let vi = 0; vi < VARIANTS.length; vi++) {
    const variant = VARIANTS[vi];
    for (let si = 0; si < SIZES.length; si++) {
      const size = SIZES[si];
      for (let ti = 0; ti < STATES.length; ti++) {
        const state = STATES[ti];
        const buttonType = 'theme';
        const orientation = 'horizontal';
        const iconPosition = 'left';
        const clone = master.clone();
        clone.name = `variant=${variant}, size=${size}, state=${state}, buttonType=${buttonType}, orientation=${orientation}, iconPosition=${iconPosition}`;
        set.appendChild(clone);

        const h = HEIGHT[size];
        const pad = PAD_X[size];
        const gap = GAP[size];
        clone.resizeWithoutConstraints(Math.max(clone.width, 48), h);
        clone.paddingLeft = pad;
        clone.paddingRight = pad;
        clone.itemSpacing = gap;
        clone.layoutMode = orientation === 'vertical' ? 'VERTICAL' : 'HORIZONTAL';
        clone.counterAxisSizingMode = 'FIXED';
        clone.primaryAxisSizingMode = 'AUTO';
        // fullWidth BOOLEAN will stretch later via layoutGrow on instances; masters hug

        const paint = paintsFor(variant, state, buttonType, vars, delaStyle);
        clone.fills = paint.fills;
        clone.strokes = paint.strokes;
        clone.strokeWeight = paint.strokeWeight;
        clone.cornerRadius = paint.radius;
        if (variant === 'dela-pill') {
          clone.topLeftRadius = h / 2;
          clone.topRightRadius = h / 2;
          clone.bottomLeftRadius = h / 2;
          clone.bottomRightRadius = h / 2;
        }

        const label = clone.findOne((n) => n.name === 'label' && n.type === 'TEXT');
        const loadingText = clone.findOne((n) => n.name === 'loadingText' && n.type === 'TEXT');
        const icon = clone.findOne((n) => n.name === 'icon');
        const content = clone.findOne((n) => n.name === 'content');
        const loading = clone.findOne((n) => n.name === 'loading');
        const dim = clone.findOne((n) => n.name === 'disabledOverlay');
        const spinner = clone.findOne((n) => n.name === 'spinner');

        const ts = textStyles[TEXT_STYLE[size]];
        if (label && ts) {
          await figma.loadFontAsync(label.fontName);
          label.textStyleId = ts.id;
          label.fills = [boundFill(paint.textVar)];
        }
        if (loadingText && ts) {
          await figma.loadFontAsync(loadingText.fontName);
          loadingText.textStyleId = ts.id;
          loadingText.fills = [boundFill(paint.textVar)];
        }
        if (spinner) {
          spinner.strokes = [boundStroke(paint.textVar)];
          const side = size === 'xs' ? 10 : size === 'sm' ? 12 : 14;
          spinner.resize(side, side);
        }
        if (icon && icon.type === 'INSTANCE') {
          const side = size === 'xs' ? 12 : size === 'sm' ? 16 : size === 'md' ? 16 : 20;
          icon.rescale(side / Math.max(icon.width, 0.001));
          // try recolor via fills if vector exposes — skip; Icon uses text-primary
        }
        if (content) content.itemSpacing = gap;
        if (loading) loading.visible = false;
        if (icon) icon.visible = false; // default: no icon until BOOLEAN
        if (dim) {
          dim.visible = false;
          dim.resize(clone.width, clone.height);
        }

        // grid position: X = size › state, Y = variant
        const col = si * STATES.length + ti;
        const row = vi;
        clone.x = col * (CELL_W + GAP_X);
        clone.y = row * (CELL_H + GAP_Y);

        created.push(clone.id);
      }
    }
  }

  // Extra cells: pageHeader for primary/secondary/tertiary @ md default
  const extras = [];
  for (const variant of ['primary', 'secondary', 'tertiary']) {
    const size = 'md';
    const state = 'default';
    const clone = master.clone();
    clone.name = `variant=${variant}, size=${size}, state=${state}, buttonType=pageHeader, orientation=horizontal, iconPosition=left`;
    set.appendChild(clone);
    const paint = paintsFor(variant, state, 'pageHeader', vars, delaStyle);
    clone.resizeWithoutConstraints(96, HEIGHT.md);
    clone.paddingLeft = PAD_X.md;
    clone.paddingRight = PAD_X.md;
    clone.fills = paint.fills;
    clone.strokes = paint.strokes;
    clone.strokeWeight = paint.strokeWeight;
    clone.cornerRadius = paint.radius;
    const label = clone.findOne((n) => n.name === 'label' && n.type === 'TEXT');
    if (label) {
      await figma.loadFontAsync(label.fontName);
      label.fills = [boundFill(paint.textVar)];
      const ts = textStyles[TEXT_STYLE.md];
      if (ts) label.textStyleId = ts.id;
    }
    const icon = clone.findOne((n) => n.name === 'icon');
    if (icon) icon.visible = false;
    clone.x = (SIZES.length * STATES.length) * (CELL_W + GAP_X) + extras.length * (CELL_W + GAP_X);
    clone.y = VARIANTS.indexOf(variant) * (CELL_H + GAP_Y);
    extras.push(clone.id);
    created.push(clone.id);
  }

  // Extra: vertical orientation sample primary md default
  {
    const clone = master.clone();
    clone.name = 'variant=primary, size=md, state=default, buttonType=theme, orientation=vertical, iconPosition=left';
    set.appendChild(clone);
    clone.layoutMode = 'VERTICAL';
    clone.resizeWithoutConstraints(64, 56);
    const paint = paintsFor('primary', 'default', 'theme', vars, delaStyle);
    clone.fills = paint.fills;
    clone.cornerRadius = paint.radius;
    const label = clone.findOne((n) => n.name === 'label' && n.type === 'TEXT');
    if (label) {
      await figma.loadFontAsync(label.fontName);
      label.fills = [boundFill(paint.textVar)];
    }
    const icon = clone.findOne((n) => n.name === 'icon');
    if (icon) {
      icon.visible = true;
      icon.rescale(16 / Math.max(icon.width, 0.001));
    }
    const content = clone.findOne((n) => n.name === 'content');
    if (content) content.layoutMode = 'VERTICAL';
    clone.x = 0;
    clone.y = VARIANTS.length * (CELL_H + GAP_Y);
    extras.push(clone.id);
    created.push(clone.id);
  }

  // Extra: iconPosition=right sample
  {
    const clone = master.clone();
    clone.name = 'variant=primary, size=md, state=default, buttonType=theme, orientation=horizontal, iconPosition=right';
    set.appendChild(clone);
    const paint = paintsFor('primary', 'default', 'theme', vars, delaStyle);
    clone.fills = paint.fills;
    clone.cornerRadius = paint.radius;
    clone.resizeWithoutConstraints(96, HEIGHT.md);
    const label = clone.findOne((n) => n.name === 'label' && n.type === 'TEXT');
    if (label) {
      await figma.loadFontAsync(label.fontName);
      label.fills = [boundFill(paint.textVar)];
    }
    const icon = clone.findOne((n) => n.name === 'icon');
    const content = clone.findOne((n) => n.name === 'content');
    if (icon && content) {
      icon.visible = true;
      content.appendChild(icon); // move after label
    }
    clone.x = CELL_W + GAP_X;
    clone.y = VARIANTS.length * (CELL_H + GAP_Y);
    extras.push(clone.id);
    created.push(clone.id);
  }

  master.remove();

  // Layout set chrome
  set.layoutMode = 'NONE';
  let maxX = 0, maxY = 0;
  for (const ch of set.children) {
    maxX = Math.max(maxX, ch.x + ch.width);
    maxY = Math.max(maxY, ch.y + ch.height);
  }
  set.resizeWithoutConstraints(maxX + 24, maxY + 24);
  set.strokes = [{ type: 'SOLID', color: { r: 0.59, g: 0.278, b: 1 } }];
  set.dashPattern = [10, 5];
  set.strokeWeight = 1;
  set.strokeAlign = 'INSIDE';

  // Wire component properties on first child references — add props then bind
  // TEXT label
  const labelProp = Object.keys(set.componentPropertyDefinitions).find((k) => k.startsWith('label')) ||
    set.addComponentProperty('label', 'TEXT', 'Button');

  // BOOLEAN props
  const disabledProp = set.addComponentProperty('disabled', 'BOOLEAN', false);
  const loadingProp = set.addComponentProperty('loading', 'BOOLEAN', false);
  const fullWidthProp = set.addComponentProperty('fullWidth', 'BOOLEAN', false);
  const loadingTextProp = set.addComponentProperty('loadingText', 'TEXT', 'Loading…');
  const iconProp = set.addComponentProperty('icon', 'INSTANCE_SWAP', iconDefault.id, {
    preferredValues: [{ type: 'COMPONENT', key: iconDefault.key }],
  });

  // Bind on every child
  for (const ch of set.children) {
    if (ch.type !== 'COMPONENT') continue;
    const label = ch.findOne((n) => n.name === 'label' && n.type === 'TEXT');
    const loadingText = ch.findOne((n) => n.name === 'loadingText' && n.type === 'TEXT');
    const icon = ch.findOne((n) => n.name === 'icon');
    const content = ch.findOne((n) => n.name === 'content');
    const loading = ch.findOne((n) => n.name === 'loading');
    const dim = ch.findOne((n) => n.name === 'disabledOverlay');

    if (label) {
      label.componentPropertyReferences = {
        ...(label.componentPropertyReferences || {}),
        characters: labelProp,
      };
    }
    if (loadingText) {
      loadingText.componentPropertyReferences = {
        ...(loadingText.componentPropertyReferences || {}),
        characters: loadingTextProp,
      };
    }
    if (icon && icon.type === 'INSTANCE') {
      icon.componentPropertyReferences = {
        ...(icon.componentPropertyReferences || {}),
        mainComponent: iconProp,
      };
    }
    // loading shows spinner row; hide content when loading via layer swap (no BOOLEAN invert)
    if (content) content.componentPropertyReferences = {};
    if (loading) {
      loading.componentPropertyReferences = {
        ...(loading.componentPropertyReferences || {}),
        visible: loadingProp,
      };
    }
    if (dim) {
      dim.componentPropertyReferences = {
        ...(dim.componentPropertyReferences || {}),
        visible: disabledProp,
      };
    }
    // fullWidth: stretch on samples/instances (BOOLEAN kept for Consumer API; wire layoutGrow on sample frames)
    void fullWidthProp;
  }

  // Hover reactions: default -> hover sibling
  for (const ch of set.children) {
    if (ch.type !== 'COMPONENT') continue;
    if (!ch.name.includes('state=default')) continue;
    const hoverName = ch.name.replace('state=default', 'state=hover');
    const hover = set.children.find((c) => c.name === hoverName);
    if (!hover) continue;
    ch.reactions = [
      {
        action: { type: 'NODE', destinationId: hover.id, navigation: 'CHANGE_TO', transition: null, resetScrollPosition: false },
        trigger: { type: 'ON_HOVER', hysteresisMs: 0 },
      },
    ];
  }

  // Hide content when loading by also binding — approximate: when loading, hide label via... skip for now
  // Prefer: loadingProp hides content if we add a second BOOLEAN — use Plugin to set content.visible = !loading on instances only.
  // Wire content visibility to inverted: create helper — Figma supports `visible` only.
  // Set content to stay visible; loading sits on top when true. Hide label+icon when loading via separate approach:
  for (const ch of set.children) {
    if (ch.type !== 'COMPONENT') continue;
    const content = ch.findOne((n) => n.name === 'content');
    if (content) {
      // no invert — leave content; designers toggle loading which shows spinner row (both may show). Fix: hide content when loading using matched pairs — not available.
      // Workaround: put content and loading as alternatives by making content.visible default true and manually document.
    }
  }

  return {
    setId: set.id,
    childCount: set.children.length,
    created: created.length,
    extras: extras.length,
    props: Object.keys(set.componentPropertyDefinitions),
  };
}

return await main();

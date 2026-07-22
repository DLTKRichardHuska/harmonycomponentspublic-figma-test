#!/usr/bin/env node
/** Scaffold a new Harmony converter (+ paired conversion for component-library). Agents invoke via Shell. */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CONVERTER_ID_PATTERN, repoRoot, convertersDir, conversionsDir, getReferenceVersion, seedCoverageElements, computeCoverage } from './_lib.mjs';

const SUBSTITUTIONS = {
  'component-library': {
    '{{TARGET_ID}}': 'target_id',
    '{{TARGET_NAME}}': 'name',
    '{{DESCRIPTION}}': 'description',
    '{{PACKAGE_NAME}}': 'package_name',
    '{{RUNTIME}}': 'runtime',
    '{{UI_LIBRARY}}': 'ui_library',
    '{{FRAMEWORK}}': 'framework_label',
  },
  external: {
    '{{TARGET_ID}}': 'target_id',
    '{{TARGET_NAME}}': 'name',
    '{{DESCRIPTION}}': 'description',
    '{{HOST_SYSTEM}}': 'host_system',
    '{{MCP_SERVER}}': 'mcp_server',
    '{{HOST_LOCATION}}': 'host_location',
  },
};

function kebabToTitle(id) {
  return id.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

function applySubstitutions(text, replacements) {
  let out = text;
  for (const [token, value] of Object.entries(replacements)) {
    out = out.split(token).join(value);
  }
  return out;
}

function copyTemplate(templateRoot, dest, templateType, values) {
  const tokenMap = SUBSTITUTIONS[templateType];
  const replacements = Object.fromEntries(
    Object.entries(tokenMap).map(([token, key]) => [token, values[key] ?? '']),
  );

  function walk(src, dstRel = '') {
    for (const name of readdirSync(src)) {
      const srcPath = join(src, name);
      const rel = join(dstRel, name);
      const dstPath = join(dest, rel);
      if (statSync(srcPath).isDirectory()) {
        mkdirSync(dstPath, { recursive: true });
        walk(srcPath, rel);
      } else {
        mkdirSync(dirname(dstPath), { recursive: true });
        const content = applySubstitutions(readFileSync(srcPath, 'utf8'), replacements);
        writeFileSync(dstPath, content, 'utf8');
      }
    }
  }
  walk(templateRoot);
}

function parseArgs(argv) {
  const positional = [];
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--type' || a === '-T') opts.type = argv[++i];
    else if (a === '--name') opts.name = argv[++i];
    else if (a === '--description') opts.description = argv[++i];
    else if (a === '--package-name') opts.packageName = argv[++i];
    else if (a === '--runtime') opts.runtime = argv[++i];
    else if (a === '--ui-library') opts.uiLibrary = argv[++i];
    else if (a === '--host-system') opts.hostSystem = argv[++i];
    else if (a === '--mcp-server') opts.mcpServer = argv[++i];
    else if (a === '--skip-validate') opts.skipValidate = true;
    else if (!a.startsWith('-')) positional.push(a);
  }
  return { positional, opts };
}

const { positional, opts } = parseArgs(process.argv.slice(2));
const converterId = positional[0]?.trim();

if (!converterId || !CONVERTER_ID_PATTERN.test(converterId)) {
  console.error('Usage: create_converter.mjs <converter-id> --type component-library|external');
  process.exit(1);
}
if (!opts.type || !['component-library', 'external'].includes(opts.type)) {
  console.error('--type component-library|external is required');
  process.exit(1);
}

const converterDest = join(convertersDir(), converterId);
if (existsSync(converterDest)) {
  console.error(`Converter already exists: ${converterDest}`);
  process.exit(1);
}

const name = opts.name ?? kebabToTitle(converterId);
const description = opts.description ?? `Harmony Design System converter: ${name}`;
const values = { target_id: converterId, name, description };

if (opts.type === 'component-library') {
  values.package_name = opts.packageName ?? `@deltek/harmony-${converterId}`;
  values.runtime = opts.runtime ?? 'unknown';
  values.ui_library = opts.uiLibrary ?? 'unknown';
  values.framework_label = `${values.runtime} + ${values.ui_library}`;
} else {
  values.host_system = opts.hostSystem ?? 'unknown';
  values.mcp_server =
    opts.mcpServer ?? `user-${values.host_system.charAt(0).toUpperCase() + values.host_system.slice(1)}`;
  values.host_location = `${values.host_system}-component-library`;
}

mkdirSync(converterDest, { recursive: true });
const templateRoot = join(convertersDir(), '_templates', opts.type);
copyTemplate(templateRoot, converterDest, opts.type, values);

const conversionSub = join(converterDest, 'conversion');
const playbookSub = join(converterDest, 'playbook');
if (existsSync(conversionSub) && !existsSync(playbookSub)) {
  renameSync(conversionSub, playbookSub);
}

for (const strip of ['package.json', 'src', 'docs', 'target.manifest.json']) {
  const p = join(converterDest, strip);
  if (existsSync(p)) rmSync(p, { recursive: true, force: true });
}

writeFileSync(
  join(converterDest, 'converter.manifest.json'),
  JSON.stringify(
    {
      id: converterId,
      name,
      type: opts.type,
      status: 'placeholder',
      description,
      ...(opts.type === 'component-library'
        ? {
            framework: {
              runtime: values.runtime,
              uiLibrary: values.ui_library,
              ...(values.ui_library === 'mui'
                ? {
                    muiVersion: String(values.mui_major ?? '9'),
                    muiVersionPolicy: { major: Number(values.mui_major ?? 9), track: 'latest' },
                  }
                : {}),
            },
            host: { mcpServer: 'user-mui-mcp' },
            conversion: {
              outputId: converterId,
              outputPath: `conversions/${converterId}`,
              playbook: 'playbook/SKILL.md',
              verification: {
                playbook: 'playbook/VERIFICATION.md',
                agent: 'playbook/VERIFIER.md',
              },
            },
            elementStrategies: {
              allowed: ['custom', 'skip'],
              descriptions: {
                custom: 'TODO: replace with converter-specific strategies in converter.manifest.json',
                skip: 'Do not convert; placeholder or accepted gap',
              },
            },
          }
        : {
            host: { system: values.host_system, mcpServer: values.mcp_server },
            conversion: {
              playbook: 'playbook/SKILL.md',
              verification: {
                playbook: 'playbook/VERIFICATION.md',
                agent: 'playbook/VERIFIER.md',
              },
            },
            elementStrategies: {
              allowed: ['skip'],
              descriptions: {
                skip: 'TODO: define host-specific strategies when sync state is modeled',
              },
            },
          }),
      readiness: {
        level: 'not-ready',
        lastReviewed: new Date().toISOString().slice(0, 10),
        summary: 'Scaffolded converter — implement playbooks before conversion work.',
      },
    },
    null,
    2,
  ) + '\n',
  'utf8',
);

if (opts.type === 'component-library') {
  const conversionDest = join(conversionsDir(), converterId);
  if (existsSync(conversionDest)) {
    console.error(`Conversion already exists: ${conversionDest}`);
    process.exit(1);
  }
  mkdirSync(conversionDest, { recursive: true });
  copyTemplate(templateRoot, conversionDest, opts.type, values);
  for (const strip of ['conversion', 'playbook', 'target.manifest.json', 'scripts', 'README.md']) {
    const p = join(conversionDest, strip);
    if (existsSync(p)) rmSync(p, { recursive: true, force: true });
  }
  mkdirSync(join(conversionDest, 'plans'), { recursive: true });
  mkdirSync(join(conversionDest, 'verification', 'artifacts'), { recursive: true });
  mkdirSync(join(conversionDest, 'verification', 'reports'), { recursive: true });

  writeFileSync(
    join(conversionDest, 'conversion.manifest.json'),
    JSON.stringify(
      (() => {
        const refVersion = getReferenceVersion();
        const base = {
          id: converterId,
          name,
          type: 'component-library',
          status: 'placeholder',
          description,
          converterId,
          referenceVersion: refVersion,
          referenceVersionSetAt: new Date().toISOString(),
          independence: { standalone: true },
          projectRoot: '.',
          elements: {},
          deliverables: {
            npmPackageName: values.package_name,
            scripts: { dev: 'dev', 'build:lib': 'build:lib' },
            exports: { './theme': './dist/theme/index.js' },
          },
          documentation: { consumerGuide: 'docs/CONSUMER.md' },
        };
        const seeded = seedCoverageElements(base);
        seeded.coverage = computeCoverage(seeded);
        return seeded;
      })(),
      null,
      2,
    ) + '\n',
    'utf8',
  );

  console.log(`Created conversion: ${conversionDest}`);

  const scriptDir = dirname(fileURLToPath(import.meta.url));
  spawnSync(process.execPath, [join(scriptDir, 'sync_conversion_versions.mjs'), '--conversion', converterId], {
    cwd: repoRoot(),
    stdio: 'inherit',
  });
}

console.log(`Created converter: ${converterDest}`);

if (!opts.skipValidate) {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const proc = spawnSync(process.execPath, [join(scriptDir, 'validate_converter.mjs'), '--converter', converterId], {
    cwd: repoRoot(),
    stdio: 'inherit',
  });
  if (opts.type === 'component-library') {
    spawnSync(process.execPath, [join(scriptDir, 'validate_conversion.mjs'), '--conversion', converterId], {
      cwd: repoRoot(),
      stdio: 'inherit',
    });
  }
  if (proc.status !== 0) {
    console.error('Validation reported issues — review and fix.');
    process.exit(proc.status ?? 1);
  }
}

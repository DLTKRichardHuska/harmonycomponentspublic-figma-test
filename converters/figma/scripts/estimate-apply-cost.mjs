#!/usr/bin/env node
/**
 * Heuristic token/efficiency forecast for Figma strategy packets.
 * Does not call Figma. Qualitative Low|Med|High only — no fabricated token counts.
 *
 * Usage:
 *   node estimate-apply-cost.mjs --axes 5,3 --states 3 --samples 20
 *   node estimate-apply-cost.mjs --axes 5 --states 1 --samples 5 --payload high --loop med
 *   node estimate-apply-cost.mjs --help
 */
function parseArgs(argv) {
  const args = {
    axes: [],
    states: 1,
    samples: 0,
    payload: 'low', // low|med|high — bulky MCP payloads expected
    loop: 'low', // low|med|high — Task / multi-pass / per-cell screenshot risk
    deps: 'low', // low|med|high — unsynced deps / unclear axes
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--axes') args.axes = String(argv[++i] || '')
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0);
    else if (a === '--states') args.states = Math.max(1, Number(argv[++i]) || 1);
    else if (a === '--samples') args.samples = Math.max(0, Number(argv[++i]) || 0);
    else if (a === '--payload') args.payload = String(argv[++i] || 'low').toLowerCase();
    else if (a === '--loop') args.loop = String(argv[++i] || 'low').toLowerCase();
    else if (a === '--deps') args.deps = String(argv[++i] || 'low').toLowerCase();
  }
  return args;
}

function levelRank(l) {
  return { low: 0, med: 1, high: 2 }[l] ?? 0;
}

function maxLevel(...levels) {
  return ['low', 'med', 'high'][Math.max(...levels.map(levelRank))];
}

function gridLevel(cells, samples) {
  if (cells >= 24 || samples >= 40) return 'high';
  if (cells >= 12 || samples >= 16) return 'med';
  return 'low';
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.axes.length) {
    console.log(`Usage:
  node estimate-apply-cost.mjs --axes <n[,n...]> [--states N] [--samples N]
       [--payload low|med|high] [--loop low|med|high] [--deps low|med|high]

Examples:
  node estimate-apply-cost.mjs --axes 5,3 --states 3 --samples 15
  node estimate-apply-cost.mjs --axes 32 --states 1 --samples 32 --payload high

Prints Low|Med|High heuristics for the strategy packet Token / efficiency forecast.`);
    process.exit(args.help ? 0 : 1);
  }

  const cells = args.axes.reduce((a, b) => a * b, 1) * args.states;
  const grid = gridLevel(cells, args.samples);
  const overall = maxLevel(grid, args.payload, args.loop, args.deps);

  const mitigations = [];
  if (grid !== 'low') {
    mitigations.push('Lock axes/state before apply; avoid screenshot-per-cell (1–2 captures + compact audit)');
  }
  if (args.payload !== 'low') {
    mitigations.push('Prep bulky data offline (Node helper); do not paste SVG/CSS dumps into chat');
  }
  if (args.loop !== 'low') {
    mitigations.push('Parent owns sequential use_figma; no Task for batch apply; one-pass after signoff');
  }
  if (args.deps !== 'low') {
    mitigations.push('Finish unsynced deps / lock strategy before apply to avoid FAIL→rebuild');
  }
  if (!mitigations.length) {
    mitigations.push('Standard Token-efficient Figma MCP defaults (curl capture, compact inspect, parent writes)');
  }

  const out = {
    overall,
    breakdown: {
      grid,
      payload: args.payload,
      loop: args.loop,
      deps: args.deps,
    },
    metrics: {
      axisSizes: args.axes,
      states: args.states,
      cells,
      samples: args.samples,
    },
    strategyPacketStub: {
      'Grid / volume': `${grid.toUpperCase()} — ${cells} cells (axes ${args.axes.join('×')} × ${args.states} state) ; samples≈${args.samples}`,
      'Payload risk': `${args.payload.toUpperCase()}`,
      'Loop risk': `${args.loop.toUpperCase()}`,
      'Dependency / redo risk': `${args.deps.toUpperCase()}`,
      'Proposed approach': 'One-pass after signoff; capture URL+curl.exe; compact use_figma returns; parent owns writes',
      'Optional trim': 'AskQuestion: fewer state values / smaller sample set / curated catalog if High',
      Mitigations: mitigations,
    },
  };

  console.log(JSON.stringify(out, null, 2));
}

main();

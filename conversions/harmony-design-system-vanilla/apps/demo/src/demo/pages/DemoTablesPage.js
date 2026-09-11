import {
  HarmonyElement,
  createSheet,
  typographySheet,
  tableSheet,
  buttonSheet,
  checkboxSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoCallout.js';
import '../elements/DemoConsumeSnippets.js';

const COLUMNS_JSON = JSON.stringify([
  { key: 'id', label: 'Project ID', align: 'left' },
  { key: 'name', label: 'Name', align: 'left' },
  { key: 'budget', label: 'Budget', align: 'right' },
]);

const CC_COLUMNS_JSON = JSON.stringify([
  { key: 'prId', label: 'PR ID', align: 'left' },
  { key: 'vendor', label: 'Preferred Vendor', align: 'left' },
  { key: 'amount', label: 'Total Amount', align: 'right' },
  { key: 'status', label: 'Status', align: 'left' },
]);

const pageSheet = createSheet(`
  .table-scroll { overflow-x: auto; }
  .filter-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-wrap: wrap;
  }
  .title-actions {
    display: flex;
    gap: var(--space-2);
    align-items: center;
  }
  .cc-toolbar {
    display: flex;
    gap: var(--space-3);
    align-items: center;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }
  .cc-aside-stub {
    padding: var(--space-4);
    border: var(--border-width-thin) solid var(--border-color);
    border-radius: var(--radius-08);
    background: var(--surface-bg);
    min-width: 12rem;
  }
`);

export class DemoTablesPage extends HarmonyElement {
  static styles = [
    typographySheet,
    demoChromeSheet,
    demoPageSheet,
    buttonSheet,
    checkboxSheet,
    tableSheet,
    pageSheet,
  ];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Tables" scope="Table">
        <p>Unclassed native <code>table</code> gets the default Harmony look. Optional light-DOM <code>&lt;harmony-table&gt;</code> maps attributes, bars, sort headers, reorder, grouped rows, and Command Center behaviors. Nest a real <code>&lt;table&gt;</code> inside the CE.</p>
      </demo-page-header>

      <demo-callout tone="warning">
        <strong>TableCostpointGrid</strong> (CP split datagrid) is out of scope for this conversion — accepted gap. Use the hybrid Table surface for standard and Command Center tables.
      </demo-callout>

      <h2>Native — default gray header</h2>
      <demo-example>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Name</th>
                <th>Status</th>
                <th class="text-right">Budget</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PRJ-001</td>
                <td>Website Redesign</td>
                <td><harmony-badge size="small" variant="success">Active</harmony-badge></td>
                <td class="text-right">$25,000</td>
              </tr>
              <tr>
                <td>PRJ-002</td>
                <td>Mobile App</td>
                <td><harmony-badge size="small" variant="orange">In Progress</harmony-badge></td>
                <td class="text-right">$150,000</td>
              </tr>
              <tr>
                <td>PRJ-003</td>
                <td>Database Migration</td>
                <td><harmony-badge size="small" variant="default">Pending</harmony-badge></td>
                <td class="text-right">$45,000</td>
              </tr>
              <tr>
                <td>PRJ-004</td>
                <td>API Gateway</td>
                <td><harmony-badge size="small" variant="info">Review</harmony-badge></td>
                <td class="text-right">$80,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </demo-example>

      <h2>Native — striped + white header</h2>
      <demo-example>
        <div class="table-scroll">
          <table class="table--striped table--header-white">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Name</th>
                <th class="text-right">Budget</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>PRJ-001</td><td>Website Redesign</td><td class="text-right">$25,000</td></tr>
              <tr><td>PRJ-002</td><td>Mobile App</td><td class="text-right">$150,000</td></tr>
              <tr><td>PRJ-003</td><td>Database Migration</td><td class="text-right">$45,000</td></tr>
            </tbody>
            <tfoot>
              <tr><td colspan="2">Total</td><td class="text-right">$220,000</td></tr>
            </tfoot>
          </table>
        </div>
      </demo-example>

      <h2>Interactive selection</h2>
      <demo-example>
        <div class="table-scroll">
          <harmony-table>
            <table>
              <thead>
                <tr>
                  <th>
                    <harmony-checkbox name="select-all" aria-label="Select all rows"></harmony-checkbox>
                  </th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr data-row-id="e1">
                  <td><harmony-checkbox name="row-e1" aria-label="Select John Doe"></harmony-checkbox></td>
                  <td>
                    <div style="display:flex;align-items:center;gap:var(--space-3)">
                      <harmony-avatar size="sm" initials="JD"></harmony-avatar>
                      <div>
                        <div>John Doe</div>
                        <div class="muted" style="margin:0">john.doe@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td>Engineering</td>
                  <td>Senior Developer</td>
                  <td>
                    <button type="button" class="btn btn--ghost btn--sm" aria-label="Actions for John Doe">
                      <harmony-icon name="ellipsis-vertical" size="sm"></harmony-icon>
                    </button>
                  </td>
                </tr>
                <tr data-row-id="e2">
                  <td><harmony-checkbox name="row-e2" aria-label="Select Jane Smith"></harmony-checkbox></td>
                  <td>
                    <div style="display:flex;align-items:center;gap:var(--space-3)">
                      <harmony-avatar size="sm" initials="JS"></harmony-avatar>
                      <div>
                        <div>Jane Smith</div>
                        <div class="muted" style="margin:0">jane.smith@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td>Design</td>
                  <td>UX Lead</td>
                  <td>
                    <button type="button" class="btn btn--ghost btn--sm" aria-label="Actions for Jane Smith">
                      <harmony-icon name="ellipsis-vertical" size="sm"></harmony-icon>
                    </button>
                  </td>
                </tr>
                <tr data-row-id="e3">
                  <td><harmony-checkbox name="row-e3" aria-label="Select Mike Johnson"></harmony-checkbox></td>
                  <td>
                    <div style="display:flex;align-items:center;gap:var(--space-3)">
                      <harmony-avatar size="sm" initials="MJ"></harmony-avatar>
                      <div>
                        <div>Mike Johnson</div>
                        <div class="muted" style="margin:0">mike.johnson@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td>Marketing</td>
                  <td>Manager</td>
                  <td>
                    <button type="button" class="btn btn--ghost btn--sm" aria-label="Actions for Mike Johnson">
                      <harmony-icon name="ellipsis-vertical" size="sm"></harmony-icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </harmony-table>
        </div>
        <p class="muted">Emits <code>selection-change</code>; selected rows get <code>.table-row--selected</code>.</p>
      </demo-example>

      <h2>Reorderable</h2>
      <demo-example>
        <div class="table-scroll">
          <harmony-table reorderable>
            <table>
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Name</th>
                  <th class="text-right">Budget</th>
                </tr>
              </thead>
              <tbody>
                <tr data-row-id="r1"><td>PRJ-001</td><td>Website Redesign</td><td class="text-right">$25,000</td></tr>
                <tr data-row-id="r2"><td>PRJ-002</td><td>Mobile App</td><td class="text-right">$150,000</td></tr>
                <tr data-row-id="r3"><td>PRJ-003</td><td>Database Migration</td><td class="text-right">$45,000</td></tr>
              </tbody>
            </table>
          </harmony-table>
        </div>
        <p class="muted">Drag the grip to reorder. Emits <code>table-reorder</code>.</p>
      </demo-example>

      <h2>Grouped</h2>
      <demo-example>
        <div class="table-scroll">
          <harmony-table grouped grouped-default-expanded="g1">
            <table>
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Name</th>
                  <th class="text-right">Budget</th>
                </tr>
              </thead>
              <tbody>
                <tr data-row-id="g1" data-has-children>
                  <td>PRJ-001</td><td>Website Redesign</td><td class="text-right">$25,000</td>
                </tr>
                <tr data-row-id="g1a" data-parent-id="g1" data-depth="1">
                  <td>PRJ-001-A</td><td>Phase 1</td><td class="text-right">$10,000</td>
                </tr>
                <tr data-row-id="g1b" data-parent-id="g1" data-depth="1">
                  <td>PRJ-001-B</td><td>Phase 2</td><td class="text-right">$15,000</td>
                </tr>
                <tr data-row-id="g2" data-has-children>
                  <td>PRJ-002</td><td>Mobile App</td><td class="text-right">$150,000</td>
                </tr>
                <tr data-row-id="g2a" data-parent-id="g2" data-depth="1">
                  <td>PRJ-002-A</td><td>iOS</td><td class="text-right">$80,000</td>
                </tr>
              </tbody>
            </table>
          </harmony-table>
        </div>
        <p class="muted">Uses <code>data-has-children</code>, <code>data-parent-id</code>, <code>data-depth</code>.</p>
      </demo-example>

      <h2>Sortable columns</h2>
      <demo-example>
        <div class="table-scroll">
          <harmony-table columns='${COLUMNS_JSON}'>
            <table>
              <tbody>
                <tr data-row-id="s1"><td>PRJ-001</td><td>Website Redesign</td><td class="text-right">$25,000</td></tr>
                <tr data-row-id="s2"><td>PRJ-002</td><td>Mobile App</td><td class="text-right">$150,000</td></tr>
                <tr data-row-id="s3"><td>PRJ-003</td><td>Database Migration</td><td class="text-right">$45,000</td></tr>
              </tbody>
            </table>
          </harmony-table>
        </div>
        <p class="muted"><code>columns</code> JSON builds the sort header. Emits <code>sort-change</code>.</p>
      </demo-example>

      <h2>Filter bar + title / action bars</h2>
      <demo-example>
        <div class="table-scroll">
          <harmony-table>
            <div slot="filter-bar" class="filter-row">
              <button type="button">Period</button>
              <button type="button">Status</button>
              <button type="button" class="btn btn--ghost btn--sm">Clear</button>
              <harmony-chip size="sm" removable>Q1 2025</harmony-chip>
              <harmony-chip size="sm" removable>Active</harmony-chip>
            </div>
            <div slot="title-bar-content"><strong>Projects</strong></div>
            <div slot="title-bar-icons" class="title-actions">
              <button type="button" class="btn btn--ghost btn--sm" aria-label="Refresh">
                <harmony-icon name="arrow-path" size="sm"></harmony-icon>
              </button>
            </div>
            <div slot="action-bar">
              <button type="button" class="btn btn--sm">Export</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Name</th>
                  <th class="text-right">Budget</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>PRJ-001</td><td>Website Redesign</td><td class="text-right">$25,000</td></tr>
                <tr><td>PRJ-002</td><td>Mobile App</td><td class="text-right">$150,000</td></tr>
              </tbody>
            </table>
          </harmony-table>
        </div>
      </demo-example>

      <h2>Command Center (brief)</h2>
      <demo-example>
        <harmony-table
          variant="commandCenter"
          columns='${CC_COLUMNS_JSON}'
          sort-column="prId"
          sort-direction="asc"
        >
          <div slot="command-center-toolbar" class="cc-toolbar">
            <span>As of today</span>
          </div>
          <div slot="command-center-aside" class="cc-aside-stub">
            <strong>Detail</strong>
            <p class="muted" style="margin: var(--space-2) 0 0;">Compose a panel here (CommandCenterPanel not converted).</p>
          </div>
          <table>
            <tbody>
              <tr data-row-id="pr1"><td>PR-1001</td><td>ACME Supplies</td><td class="text-right">$4,200</td><td>Open</td></tr>
              <tr data-row-id="pr2"><td>PR-1002</td><td>Contoso LLC</td><td class="text-right">$1,150</td><td>Pending</td></tr>
              <tr data-row-id="pr3"><td>PR-1003</td><td>Fabrikam Parts</td><td class="text-right">$880</td><td>Open</td></tr>
            </tbody>
          </table>
        </harmony-table>
        <p class="muted">Defaults striped. Row click emits <code>row-select</code>.</p>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Surface</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td>Unclassed <code>table</code></td><td>Default gray-header Harmony table</td></tr>
            <tr><td><code>.table--*</code> modifiers</td><td>white/none header, striped, reorderable, grouped, command-center</td></tr>
            <tr><td><code>&lt;harmony-table&gt;</code></td><td>Light-DOM hybrid; nest a real <code>table</code>; optional bar slots</td></tr>
            <tr><td><code>tableSheet</code></td><td>Adopt in Shadow hosts</td></tr>
          </tbody>
        </table>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Usage guidelines</h2>
      <demo-example>
        <h3>Best practices</h3>
        <ul>
          <li>Use a real <code>&lt;table&gt;</code> with header cells for sortable and selectable data.</li>
          <li>Prefer unclassed native tables for simple read-only grids; use <code>harmony-table</code> when you need bars, sort headers, reorder, or grouping.</li>
          <li>Keep Status and other categorical cells as synced Badge/Chip surfaces for color meaning.</li>
          <li>Put summary rows in native <code>&lt;tfoot&gt;</code> (not a classed body row).</li>
          <li>Emit sort/filter intents from the CE; keep sorting and filtering logic in the host app.</li>
        </ul>
        <h3>Accessibility</h3>
        <p>Use a real <code>&lt;table&gt;</code> with <code>th</code> scope. Sortable headers set <code>aria-sort</code>. Expand and grip controls have accessible names. Forced-colors: document CSS in <code>table.css</code>.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-table striped>\n` +
      `  <table>\n` +
      `    <thead><tr><th>Name</th><th class="text-right">Amount</th></tr></thead>\n` +
      `    <tbody><tr><td>Alpha</td><td class="text-right">$10</td></tr></tbody>\n` +
      `  </table>\n` +
      `</harmony-table>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<table class="table--striped">\n` +
      `  <thead><tr><th>Name</th><th class="text-right">Amount</th></tr></thead>\n` +
      `  <tbody><tr><td>Alpha</td><td class="text-right">$10</td></tr></tbody>\n` +
      `</table>`;
  }
}

if (!customElements.get('demo-tables-page')) {
  customElements.define('demo-tables-page', DemoTablesPage);
}

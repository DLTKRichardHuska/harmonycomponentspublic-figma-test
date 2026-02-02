#!/usr/bin/env node
/**
 * Add structureSummary and aiContext to component JSON files that don't have them.
 * Run from repo root: node scripts/add-structure-summary-ai-context.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const componentsDir = path.join(__dirname, '..', 'mcp-data', 'components');

const SHORT_SUMMARIES = {
  Avatar: 'Root div with optional Icon or image/initials. Size sm/md/lg.',
  Checkbox: 'Root (input or div) with optional label; checked state.',
  CheckboxGroup: 'Wrapper div; slot for Checkbox children; orientation prop.',
  Chip: 'Span or button with optional icon and label; removable variant.',
  DateInput: 'Input wrapper with date picker; label, icon, error.',
  DatePicker: 'Calendar/date picker UI; structure from pickerpopup.',
  DateTimePicker: 'Date + time combined picker.',
  Dropdown: 'Trigger button + menu (slot or options).',
  Icon: 'Span wrapping SVG; name resolves to Heroicons or custom.',
  Kanban: 'Board with columns; title bar, action bar, column slots.',
  KanbanCard: 'Card within kanban column; badges, actions.',
  ListMenu: 'List of items; optional icon, label, active state.',
  MonthPicker: 'Month/year picker.',
  NotificationBadge: 'Badge overlay (e.g. count) on trigger element.',
  NumberInput: 'Input type number with optional label, error.',
  PickerPopup: 'Popup container for picker content.',
  ProgressBar: 'Bar element with value/max; optional label.',
  RadioButton: 'Input radio with optional label.',
  RadioGroup: 'Wrapper for RadioButton children; name for group.',
  RangeInput: 'Input type range; min, max, value.',
  Spinner: 'Loading spinner (circle animation).',
  Step: 'Single step in stepper; icon or number, label.',
  Stepper: 'Horizontal steps; Step children; current step.',
  Table: 'Table element; header, body, optional footer.',
  TabStrip: 'Tabs container; tab buttons, optional add/more.',
  Textarea: 'Textarea with optional label, error.',
  TimePicker: 'Time input/picker.',
  Toggle: 'Switch control; on/off state.',
  Tooltip: 'Wrapper with trigger slot; tooltip content on hover.',
  WeekPicker: 'Week/year picker.',
};

function addToComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  const componentName = data.name;

  if (data.structureSummary && data.aiContext) return false;

  const structureSummary = SHORT_SUMMARIES[componentName] || `See structure root and children.`;
  const aiContext = data.aiContext || { typicalCompositions: [], relatedComponents: [] };

  if (!data.structureSummary) {
    data.structureSummary = structureSummary;
  }
  if (!data.aiContext) {
    data.aiContext = aiContext;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  return true;
}

const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.json'));
let updated = 0;
for (const file of files) {
  const filePath = path.join(componentsDir, file);
  if (addToComponent(filePath)) {
    console.log('Updated:', file);
    updated++;
  }
}
console.log('\nUpdated', updated, 'component(s).');

import { Routes, Route, Navigate } from 'react-router-dom';
import { DemoShell } from '../demo/DemoShell';
import { PlaceholderPage } from '../demo/PlaceholderPage';
import { DemoHomePage } from '../demo/pages/DemoHomePage';
import { GettingStartedPage } from '../demo/pages/GettingStartedPage';
import { ChangelogPage } from '../demo/pages/ChangelogPage';
import {
  ColorsDemo,
  TypographyDemo,
  SpacingDemo,
  ElevationsDemo,
  DelaDemo,
} from '../demo/converted/foundation';
import { IconsDemo } from '../demo/converted/Icon';
import { ButtonsDemo } from '../demo/converted/Button';
import { SpinnersDemo } from '../demo/converted/Spinner';
import { ProgressBarDemo } from '../demo/converted/ProgressBar';
import { ButtonGroupsDemo } from '../demo/converted/ButtonGroup';
import { BadgesDemo } from '../demo/converted/Badge';
import { NotificationBadgesDemo } from '../demo/converted/NotificationBadge';
import { ChipsDemo } from '../demo/converted/Chip';
import { AvatarsDemo } from '../demo/converted/Avatar';
import { AlertsDemo } from '../demo/converted/Alert';
import { LabelsDemo } from '../demo/converted/Label';
import { InputsDemo } from '../demo/converted/Input';
import { SpecialtyInputsDemo } from '../demo/converted/NumberInput';
import { DatePickerDemo } from '../demo/converted/DateInput';
import { CardsDemo } from '../demo/converted/Card';
import { DialogsDemo } from '../demo/converted/Dialog';
import { CheckboxesDemo } from '../demo/converted/Checkbox';
import { CheckboxGroupsDemo } from '../demo/converted/CheckboxGroup';
import { RadioButtonsDemo } from '../demo/converted/RadioButton';
import { RadioGroupsDemo } from '../demo/converted/RadioGroup';
import { LinksDemo } from '../demo/converted/Link';
import { TooltipsDemo } from '../demo/converted/Tooltip';
import { TogglesDemo } from '../demo/converted/Toggle';
import { DropdownsDemo } from '../demo/converted/Dropdown';
import { AccordionsDemo } from '../demo/converted/Accordion';
import { ListMenusDemo } from '../demo/converted/ListMenu';
import { SteppersDemo } from '../demo/converted/Stepper';
import { TabStripsDemo } from '../demo/converted/TabStrip';
import {
  ShellLayoutDemo,
  ShellHeaderDemo,
  ShellFooterDemo,
  ShellPageHeaderDemo,
  PageContentDemo,
  LeftSidebarDemo,
  RightSidebarDemo,
  ShellPanelDemo,
  FloatingNavDemo,
} from '../demo/converted/Shell';
import { allDemoHrefs, extraThemeHrefs } from '../demo/demoNavigation';

const convertedRoutes = new Set([
  '/foundation/colors',
  '/foundation/typography',
  '/foundation/spacing',
  '/foundation/elevations',
  '/foundation/dela',
  '/components/icons',
  '/components/buttons',
  '/components/spinner',
  '/components/progress-bar',
  '/components/button-groups',
  '/components/badges',
  '/components/notification-badges',
  '/components/chips',
  '/components/avatar',
  '/components/alerts',
  '/components/labels',
  '/components/inputs',
  '/components/specialty-inputs',
  '/components/date-picker',
  '/components/cards',
  '/components/dialogs',
  '/components/checkboxes',
  '/components/checkbox-groups',
  '/components/radio-buttons',
  '/components/radio-groups',
  '/components/links',
  '/components/tooltips',
  '/components/toggle-switches',
  '/components/dropdowns',
  '/components/accordion',
  '/components/list-menu',
  '/components/stepper',
  '/components/tab-strip',
  '/shell/layout',
  '/shell/header',
  '/shell/footer',
  '/shell/page-header',
  '/shell/page-content',
  '/shell/left-sidebar',
  '/shell/right-sidebar',
  '/shell/panel',
  '/cp/floating-nav',
]);

const placeholderHrefs = [
  ...allDemoHrefs().filter(
    (href) =>
      href !== '/getting-started' &&
      href !== '/changelog' &&
      !convertedRoutes.has(href),
  ),
  ...extraThemeHrefs.filter((href) => !convertedRoutes.has(href)),
];

export function App() {
  return (
    <DemoShell>
      <Routes>
        <Route path="/" element={<DemoHomePage />} />
        <Route path="/getting-started" element={<GettingStartedPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/foundation/colors" element={<ColorsDemo />} />
        <Route path="/foundation/typography" element={<TypographyDemo />} />
        <Route path="/foundation/spacing" element={<SpacingDemo />} />
        <Route path="/foundation/elevations" element={<ElevationsDemo />} />
        <Route path="/foundation/dela" element={<DelaDemo />} />
        <Route path="/components/icons" element={<IconsDemo />} />
        <Route path="/components/buttons" element={<ButtonsDemo />} />
        <Route path="/components/spinner" element={<SpinnersDemo />} />
        <Route path="/components/progress-bar" element={<ProgressBarDemo />} />
        <Route path="/components/button-groups" element={<ButtonGroupsDemo />} />
        <Route path="/components/badges" element={<BadgesDemo />} />
        <Route path="/components/notification-badges" element={<NotificationBadgesDemo />} />
        <Route path="/components/chips" element={<ChipsDemo />} />
        <Route path="/components/avatar" element={<AvatarsDemo />} />
        <Route path="/components/alerts" element={<AlertsDemo />} />
        <Route path="/components/labels" element={<LabelsDemo />} />
        <Route path="/components/inputs" element={<InputsDemo />} />
        <Route path="/components/specialty-inputs" element={<SpecialtyInputsDemo />} />
        <Route path="/components/date-picker" element={<DatePickerDemo />} />
        <Route path="/components/cards" element={<CardsDemo />} />
        <Route path="/components/dialogs" element={<DialogsDemo />} />
        <Route path="/components/checkboxes" element={<CheckboxesDemo />} />
        <Route path="/components/checkbox-groups" element={<CheckboxGroupsDemo />} />
        <Route path="/components/radio-buttons" element={<RadioButtonsDemo />} />
        <Route path="/components/radio-groups" element={<RadioGroupsDemo />} />
        <Route path="/components/links" element={<LinksDemo />} />
        <Route path="/components/tooltips" element={<TooltipsDemo />} />
        <Route path="/components/toggle-switches" element={<TogglesDemo />} />
        <Route path="/components/dropdowns" element={<DropdownsDemo />} />
        <Route path="/components/accordion" element={<AccordionsDemo />} />
        <Route path="/components/list-menu" element={<ListMenusDemo />} />
        <Route path="/components/stepper" element={<SteppersDemo />} />
        <Route path="/components/tab-strip" element={<TabStripsDemo />} />
        <Route path="/shell/layout" element={<ShellLayoutDemo />} />
        <Route path="/shell/header" element={<ShellHeaderDemo />} />
        <Route path="/shell/footer" element={<ShellFooterDemo />} />
        <Route path="/shell/page-header" element={<ShellPageHeaderDemo />} />
        <Route path="/shell/page-content" element={<PageContentDemo />} />
        <Route path="/shell/left-sidebar" element={<LeftSidebarDemo />} />
        <Route path="/shell/right-sidebar" element={<RightSidebarDemo />} />
        <Route path="/shell/panel" element={<ShellPanelDemo />} />
        <Route path="/cp/floating-nav" element={<FloatingNavDemo />} />
        {placeholderHrefs.map((href) => (
          <Route key={href} path={href} element={<PlaceholderPage path={href} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DemoShell>
  );
}

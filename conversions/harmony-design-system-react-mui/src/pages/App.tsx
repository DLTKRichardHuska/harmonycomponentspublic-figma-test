import { Routes, Route, Navigate } from 'react-router-dom';
import { ButtonsDemo } from '../demo/converted/Button/ButtonsDemo';
import { AlertsDemo } from '../demo/converted/Alert/AlertsDemo';
import {
  ColorsDemo,
  DelaDemo,
  ElevationsDemo,
  SpacingDemo,
  TypographyDemo,
} from '../demo/converted/foundation';
import { IconsDemo } from '../demo/converted/Icon/IconsDemo';
import { LinksDemo } from '../demo/converted/Link/LinksDemo';
import { ProgressBarDemo } from '../demo/converted/ProgressBar/ProgressBarDemo';
import { BadgesDemo } from '../demo/converted/Badge/BadgesDemo';
import { ChipsDemo } from '../demo/converted/Chip/ChipsDemo';
import { NotificationBadgesDemo } from '../demo/converted/NotificationBadge/NotificationBadgesDemo';
import { TooltipsDemo } from '../demo/converted/Tooltip/TooltipsDemo';
import { ButtonGroupsDemo } from '../demo/converted/ButtonGroup/ButtonGroupsDemo';
import { SpinnersDemo } from '../demo/converted/Spinner/SpinnersDemo';
import { AvatarsDemo } from '../demo/converted/Avatar/AvatarsDemo';
import { CardsDemo } from '../demo/converted/Card/CardsDemo';
import { CheckboxesDemo } from '../demo/converted/Checkbox/CheckboxesDemo';
import { CheckboxGroupsDemo } from '../demo/converted/CheckboxGroup/CheckboxGroupsDemo';
import { RadioButtonsDemo } from '../demo/converted/RadioButton/RadioButtonsDemo';
import { RadioGroupsDemo } from '../demo/converted/RadioGroup/RadioGroupsDemo';
import { InputsDemo } from '../demo/converted/Input/InputsDemo';
import { LabelsDemo } from '../demo/converted/Label/LabelsDemo';
import { SpecialtyInputsDemo } from '../demo/converted/NumberInput/SpecialtyInputsDemo';
import { DatePickerDemo } from '../demo/converted/DateInput/DatePickerDemo';
import { DialogsDemo } from '../demo/converted/Dialog/DialogsDemo';
import { TogglesDemo } from '../demo/converted/Toggle/TogglesDemo';
import { DropdownsDemo } from '../demo/converted/Dropdown/DropdownsDemo';
import { AccordionsDemo } from '../demo/converted/Accordion/AccordionsDemo';
import { ListMenusDemo } from '../demo/converted/ListMenu/ListMenusDemo';
import { SteppersDemo } from '../demo/converted/Stepper/SteppersDemo';
import { TabStripsDemo } from '../demo/converted/TabStrip/TabStripsDemo';
import { DemoShell } from '../demo/DemoShell';
import { PlaceholderPage } from '../demo/PlaceholderPage';
import { demoAppRoutes } from '../demo/demoAppRoutes';
import { ChangelogPage } from '../demo/pages/ChangelogPage';
import { DemoHomePage } from '../demo/pages/DemoHomePage';
import { GettingStartedPage } from '../demo/pages/GettingStartedPage';

function ConvertedRoute({ path }: { path: string }) {
  switch (path) {
    case '/foundation/colors':
      return <ColorsDemo />;
    case '/foundation/typography':
      return <TypographyDemo />;
    case '/foundation/spacing':
      return <SpacingDemo />;
    case '/foundation/elevations':
      return <ElevationsDemo />;
    case '/foundation/dela':
      return <DelaDemo />;
    case '/components/buttons':
      return <ButtonsDemo />;
    case '/components/alerts':
      return <AlertsDemo />;
    case '/components/icons':
      return <IconsDemo />;
    case '/components/links':
      return <LinksDemo />;
    case '/components/progress-bar':
      return <ProgressBarDemo />;
    case '/components/badges':
      return <BadgesDemo />;
    case '/components/chips':
      return <ChipsDemo />;
    case '/components/notification-badges':
      return <NotificationBadgesDemo />;
    case '/components/tooltips':
      return <TooltipsDemo />;
    case '/components/button-groups':
      return <ButtonGroupsDemo />;
    case '/components/spinner':
      return <SpinnersDemo />;
    case '/components/avatar':
      return <AvatarsDemo />;
    case '/components/cards':
      return <CardsDemo />;
    case '/components/checkboxes':
      return <CheckboxesDemo />;
    case '/components/checkbox-groups':
      return <CheckboxGroupsDemo />;
    case '/components/radio-buttons':
      return <RadioButtonsDemo />;
    case '/components/radio-groups':
      return <RadioGroupsDemo />;
    case '/components/inputs':
      return <InputsDemo />;
    case '/components/labels':
      return <LabelsDemo />;
    case '/components/specialty-inputs':
      return <SpecialtyInputsDemo />;
    case '/components/date-picker':
      return <DatePickerDemo />;
    case '/components/dialogs':
      return <DialogsDemo />;
    case '/components/toggle-switches':
      return <TogglesDemo />;
    case '/components/dropdowns':
      return <DropdownsDemo />;
    case '/components/accordion':
      return <AccordionsDemo />;
    case '/components/list-menu':
      return <ListMenusDemo />;
    case '/components/stepper':
      return <SteppersDemo />;
    case '/components/tab-strip':
      return <TabStripsDemo />;
    default:
      return null;
  }
}

function RouteContent({ path }: { path: string }) {
  const route = demoAppRoutes.find((r) => r.path === path);
  if (!route) return <Navigate to="/" replace />;

  if (route.kind === 'home') return <DemoHomePage />;
  if (route.kind === 'getting-started') return <GettingStartedPage />;
  if (route.kind === 'changelog') return <ChangelogPage />;

  const converted = <ConvertedRoute path={path} />;
  if (converted) return converted;

  return <PlaceholderPage title={route.title} scope={route.scope} />;
}

export function App() {
  return (
    <Routes>
      <Route element={<DemoShell />}>
        {demoAppRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path === '/' ? '/' : route.path.replace(/^\//, '')}
            element={<RouteContent path={route.path} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

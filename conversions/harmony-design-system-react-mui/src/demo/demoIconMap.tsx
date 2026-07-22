import type { ReactElement } from 'react';
import ArrowPathIcon from '@mui/icons-material/Autorenew';
import ArrowsUpDownIcon from '@mui/icons-material/UnfoldMore';
import Bars3Icon from '@mui/icons-material/Menu';
import Bars3BottomLeftIcon from '@mui/icons-material/MenuOpen';
import Bars3BottomRightIcon from '@mui/icons-material/MenuOpen';
import BellIcon from '@mui/icons-material/Notifications';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import ChartBarIcon from '@mui/icons-material/BarChart';
import ChatBubbleLeftIcon from '@mui/icons-material/ChatBubbleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import ChevronUpDownIcon from '@mui/icons-material/UnfoldMore';
import ClipboardDocumentCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ClockIcon from '@mui/icons-material/Schedule';
import CursorArrowRippleIcon from '@mui/icons-material/AdsClick';
import DocumentTextIcon from '@mui/icons-material/Description';
import ExclamationCircleIcon from '@mui/icons-material/ErrorOutlined';
import HashtagIcon from '@mui/icons-material/Tag';
import LinkIcon from '@mui/icons-material/Link';
import ListBulletIcon from '@mui/icons-material/FormatListBulleted';
import NavigationIcon from '@mui/icons-material/Navigation';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import PencilSquareIcon from '@mui/icons-material/Edit';
import QueueListIcon from '@mui/icons-material/ViewList';
import RectangleGroupIcon from '@mui/icons-material/ViewModule';
import SparklesIcon from '@mui/icons-material/AutoAwesome';
import Squares2x2Icon from '@mui/icons-material/GridView';
import StarIcon from '@mui/icons-material/Star';
import StopIcon from '@mui/icons-material/Circle';
import SwatchIcon from '@mui/icons-material/Palette';
import TableCellsIcon from '@mui/icons-material/TableChart';
import TagIcon from '@mui/icons-material/LocalOffer';
import UserIcon from '@mui/icons-material/Person';
import ViewColumnsIcon from '@mui/icons-material/ViewColumn';
import WindowIcon from '@mui/icons-material/WebAsset';
import SquaresPlusIcon from '@mui/icons-material/DashboardCustomize';
import MagnifyingGlassIcon from '@mui/icons-material/Search';
import SunIcon from '@mui/icons-material/LightMode';
import MoonIcon from '@mui/icons-material/DarkMode';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import CheckIcon from '@mui/icons-material/Check';
import PaintBrushIcon from '@mui/icons-material/Brush';
import CubeIcon from '@mui/icons-material/ViewInAr';

const iconMap: Record<string, () => ReactElement> = {
  'arrow-path': () => <ArrowPathIcon fontSize="inherit" />,
  'arrows-pointing-out': () => <OpenInFullIcon fontSize="inherit" />,
  'arrows-up-down': () => <ArrowsUpDownIcon fontSize="inherit" />,
  'bars-3': () => <Bars3Icon fontSize="inherit" />,
  'bars-3-bottom-left': () => <Bars3BottomLeftIcon fontSize="inherit" />,
  'bars-3-bottom-right': () => <Bars3BottomRightIcon fontSize="inherit" sx={{ transform: 'scaleX(-1)' }} />,
  bell: () => <BellIcon fontSize="inherit" />,
  calendar: () => <CalendarIcon fontSize="inherit" />,
  'chart-bar': () => <ChartBarIcon fontSize="inherit" />,
  'chat-bubble-left': () => <ChatBubbleLeftIcon fontSize="inherit" />,
  'check-circle': () => <CheckCircleIcon fontSize="inherit" />,
  check: () => <CheckIcon fontSize="inherit" />,
  'chevron-down': () => <ChevronDownIcon fontSize="inherit" />,
  'chevron-up-down': () => <ChevronUpDownIcon fontSize="inherit" />,
  'clipboard-document-check': () => <ClipboardDocumentCheckIcon fontSize="inherit" />,
  clock: () => <ClockIcon fontSize="inherit" />,
  'cursor-arrow-ripple': () => <CursorArrowRippleIcon fontSize="inherit" />,
  'document-text': () => <DocumentTextIcon fontSize="inherit" />,
  'exclamation-circle': () => <ExclamationCircleIcon fontSize="inherit" />,
  hashtag: () => <HashtagIcon fontSize="inherit" />,
  link: () => <LinkIcon fontSize="inherit" />,
  'list-bullet': () => <ListBulletIcon fontSize="inherit" />,
  navigation: () => <NavigationIcon fontSize="inherit" />,
  'paint-brush': () => <PaintBrushIcon fontSize="inherit" />,
  cube: () => <CubeIcon fontSize="inherit" />,
  'pencil-square': () => <PencilSquareIcon fontSize="inherit" />,
  'queue-list': () => <QueueListIcon fontSize="inherit" />,
  'rectangle-group': () => <RectangleGroupIcon fontSize="inherit" />,
  sparkles: () => <SparklesIcon fontSize="inherit" />,
  'squares-2x2': () => <Squares2x2Icon fontSize="inherit" />,
  'squares-plus': () => <SquaresPlusIcon fontSize="inherit" />,
  star: () => <StarIcon fontSize="inherit" />,
  stop: () => <StopIcon fontSize="inherit" />,
  swatch: () => <SwatchIcon fontSize="inherit" />,
  'table-cells': () => <TableCellsIcon fontSize="inherit" />,
  tag: () => <TagIcon fontSize="inherit" />,
  user: () => <UserIcon fontSize="inherit" />,
  'view-columns': () => <ViewColumnsIcon fontSize="inherit" />,
  window: () => <WindowIcon fontSize="inherit" />,
  'magnifying-glass': () => <MagnifyingGlassIcon fontSize="inherit" />,
  sun: () => <SunIcon fontSize="inherit" />,
  moon: () => <MoonIcon fontSize="inherit" />,
  'x-mark': () => <CloseIcon fontSize="inherit" />,
  'brand-github': () => <GitHubIcon fontSize="inherit" />,
};

export function DemoIcon({ name, className }: { name: string; className?: string }) {
  const render = iconMap[name];
  if (!render) {
    return <Squares2x2Icon fontSize="inherit" className={className} />;
  }
  const icon = render();
  return className ? <span className={className}>{icon}</span> : icon;
}

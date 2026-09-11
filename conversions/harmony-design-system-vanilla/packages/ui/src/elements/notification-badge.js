import { createSheet } from './HarmonyElement.js';
import { notificationBadgeCss } from '../styles/generated/notificationBadgeCss.js';

/** Notification-badge recipe as a constructable stylesheet for Shadow DOM hosts (CE-only). */
export const notificationBadgeSheet = createSheet(notificationBadgeCss);

export { notificationBadgeCss };

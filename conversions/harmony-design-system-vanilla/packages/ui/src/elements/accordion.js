import { createSheet } from './HarmonyElement.js';
import { accordionCss } from '../styles/generated/accordionCss.js';
import { accordionItemCss } from '../styles/generated/accordionItemCss.js';

export const accordionSheet = createSheet(accordionCss);
export const accordionItemSheet = createSheet(accordionItemCss);

export { accordionCss, accordionItemCss };

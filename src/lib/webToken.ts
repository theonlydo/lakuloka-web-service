/**
 * Server-side only. Derives the daily X-Menu-Key shared by every
 * lakuloka-web -> lakuloka-be call. Never import this in client components.
 */

import { createHmac } from 'node:crypto';

const DEFAULT_API_BASE_URL = 'https://mw.lakuloka.id/api/v1';

export function getApiBaseUrl(): string {
  return (process.env.LAKULOKA_API_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
}

export function getWebToken(now: Date = new Date()): string {
  const secret = process.env.MENU_API_SECRET || '';
  if (!secret) {
    throw new Error('MENU_API_SECRET is not configured');
  }
  return createHmac('sha256', secret)
    .update(`lakuloka-web:v1:${jakartaDate(now)}`)
    .digest('hex');
}

export function webHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Menu-Key': getWebToken(),
  };
}

function jakartaDate(at: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(at);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

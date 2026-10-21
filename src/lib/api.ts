/**
 * Server-side API helper — NEVER import this in client components.
 * All calls inject X-Menu-Key from process.env.MENU_API_SECRET.
 */

import type { BusinessInfo, MenuData, OrderResult, CreateOrderPayload } from './types';

function getBaseUrl(): string {
  return process.env.LAKULOKA_API_URL ?? 'https://api.lakuloka.id/v1';
}

function getMenuKey(): string {
  return process.env.MENU_API_SECRET ?? '';
}

function menuHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Menu-Key': getMenuKey(),
  };
}

export async function fetchBusinessInfo(businessId: string): Promise<BusinessInfo> {
  const res = await fetch(
    `${getBaseUrl()}/digital-menu/${encodeURIComponent(businessId)}`,
    { headers: menuHeaders(), cache: 'no-store' }
  );

  if (res.status === 404) throw new Error('BUSINESS_NOT_FOUND');
  if (res.status === 403) throw new Error('MENU_DISABLED');
  if (!res.ok) throw new Error(`Failed to fetch business info: ${res.status}`);

  const json = await res.json();
  return (json.data ?? json) as BusinessInfo;
}

export async function fetchMenuProducts(businessId: string): Promise<MenuData> {
  const res = await fetch(
    `${getBaseUrl()}/digital-menu/${encodeURIComponent(businessId)}/products`,
    { headers: menuHeaders(), cache: 'no-store' }
  );

  if (res.status === 404) throw new Error('BUSINESS_NOT_FOUND');
  if (res.status === 403) throw new Error('MENU_DISABLED');
  if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status}`);

  const json = await res.json();
  const data = (json.data ?? json) as MenuData;
  // Ensure arrays are never undefined even if API returns null/missing
  // Normalize variant options: some API responses use `name` instead of `listName`
  const products = (Array.isArray(data.products) ? data.products : []).map((product) => ({
    ...product,
    variants: (product.variants ?? []).map((variant) => ({
      ...variant,
      options: (variant.options ?? []).map((opt) => ({
        ...opt,
        listName: opt.listName || ((opt as unknown as { name?: string }).name ?? ''),
      })),
    })),
  }));
  return {
    products,
    categories: Array.isArray(data.categories) ? data.categories : [],
  };
}

export async function createOrder(
  businessId: string,
  payload: CreateOrderPayload
): Promise<OrderResult> {
  const res = await fetch(
    `${getBaseUrl()}/digital-menu/${encodeURIComponent(businessId)}/order`,
    {
      method: 'POST',
      headers: menuHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (res.status === 404) throw new Error('BUSINESS_NOT_FOUND');
  if (res.status === 403) throw new Error('MENU_DISABLED');

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Order failed (${res.status}): ${body}`);
  }

  const json = await res.json();
  return (json.data ?? json) as OrderResult;
}

/**
 * Server-side API helper for the F-33 table-ordering domain (Gold+ self-pay
 * + dine-in open bill) — NEVER import this in client components. A separate
 * file from api.ts on purpose: this talks to lakuloka-be's isolated
 * /table-ordering/* group.
 */

import { getApiBaseUrl, webHeaders } from './webToken';
import type {
  CreateSelfPayOrderPayload,
  SelfPayOrderResult,
  SelfPayStatusResult,
} from './types';

// unwrap reads lakuloka-be's {success,data,meta,error} envelope, throwing the
// upstream error message on failure rather than returning a half-parsed shape.
async function unwrap<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    const message = json?.error?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return json.data as T;
}

export async function checkTableOrderingAvailability(businessId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${getApiBaseUrl()}/table-ordering/${encodeURIComponent(businessId)}/availability`,
      { headers: webHeaders(), cache: 'no-store' }
    );
    const data = await unwrap<{ available: boolean }>(res);
    return data.available === true;
  } catch {
    // Fail closed on any error — never show the self-pay UI if we can't
    // confirm it's actually available.
    return false;
  }
}

export async function createSelfPayOrder(
  businessId: string,
  payload: CreateSelfPayOrderPayload,
  timezone?: string
): Promise<SelfPayOrderResult> {
  const res = await fetch(
    `${getApiBaseUrl()}/table-ordering/${encodeURIComponent(businessId)}/orders`,
    {
      method: 'POST',
      headers: { ...webHeaders(), ...(timezone ? { 'X-Timezone': timezone } : {}) },
      body: JSON.stringify(payload),
    }
  );
  return unwrap<SelfPayOrderResult>(res);
}

export async function getSelfPayOrderStatus(
  businessId: string,
  orderToken: string
): Promise<SelfPayStatusResult> {
  const res = await fetch(
    `${getApiBaseUrl()}/table-ordering/${encodeURIComponent(businessId)}/orders/${encodeURIComponent(orderToken)}/status`,
    { headers: webHeaders(), cache: 'no-store' }
  );
  return unwrap<SelfPayStatusResult>(res);
}

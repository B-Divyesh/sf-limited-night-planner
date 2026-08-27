const SLUG = 'limited-night-planner';
const API_BASE = 'https://api.sociobot.in/api/v1';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const DAY = 86_400_000;

interface Verdict {
  valid: boolean;
  checkedAt: number;
  reason?: string;
}

export interface LicenseState {
  unlocked: boolean;
  checking: boolean;
  notice: string;
  token: string;
}

export const checkoutUrl = `${API_BASE}/products/${SLUG}/checkout`;

function readVerdict(): Verdict | null {
  try {
    return JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as Verdict | null;
  } catch {
    return null;
  }
}

export function captureReturnedLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: true, checkedAt: 0, reason: 'pending' }));
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function initialLicenseState(): LicenseState {
  const token = localStorage.getItem(LICENSE_KEY) ?? '';
  const verdict = readVerdict();
  return {
    token,
    unlocked: Boolean(token && verdict?.valid),
    checking: false,
    notice: verdict && !verdict.valid ? 'License no longer active.' : '',
  };
}

export function storeLicense(token: string): void {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: false, checkedAt: 0, reason: 'pending' }));
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = localStorage.getItem(LICENSE_KEY) ?? '';
  if (!token) return { token: '', unlocked: false, checking: false, notice: '' };
  const cached = readVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) {
    return { token, unlocked: cached.valid, checking: false, notice: cached.valid ? '' : 'License no longer active.' };
  }

  try {
    const response = await fetch(`${API_BASE}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error('Verification service unavailable.');
    const result = await response.json() as { valid?: boolean; reason?: string };
    const verdict = { valid: result.valid === true, reason: result.reason, checkedAt: Date.now() };
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    return {
      token,
      unlocked: verdict.valid,
      checking: false,
      notice: verdict.valid ? 'Night Pass restored on this device.' : 'License no longer active.',
    };
  } catch {
    return {
      token,
      unlocked: cached?.valid === true,
      checking: false,
      notice: cached?.valid
        ? 'Offline: using your last verified Night Pass.'
        : 'Could not verify while offline. Your free planner still works.',
    };
  }
}

const SLUG = 'limited-night-planner';
const API_BASE = 'https://api.sociobot.in/api/v1';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const DAY = 86_400_000;
let memoryToken = '';
let memoryVerdict: Verdict | null = null;

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

function readStoredValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStoredValue(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function currentToken(): string {
  return readStoredValue(LICENSE_KEY) ?? memoryToken;
}

function readVerdict(): Verdict | null {
  const stored = readStoredValue(VERDICT_KEY);
  if (stored === null) return memoryVerdict;
  try {
    return JSON.parse(stored) as Verdict | null;
  } catch {
    return memoryVerdict;
  }
}

function storeVerdict(verdict: Verdict): void {
  memoryVerdict = verdict;
  writeStoredValue(VERDICT_KEY, JSON.stringify(verdict));
}

/**
 * Paid access can survive an offline visit only after this exact token has
 * received a successful answer from the billing service.  `checkedAt: 0` is
 * deliberately reserved for a just-returned or pasted token that has not yet
 * been verified.
 */
function hasVerifiedPass(verdict: Verdict | null): boolean {
  return verdict?.valid === true && verdict.checkedAt > 0 && verdict.reason !== 'pending';
}

export function captureReturnedLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  memoryToken = token;
  writeStoredValue(LICENSE_KEY, token);
  storeVerdict({ valid: false, checkedAt: 0, reason: 'pending' });
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function initialLicenseState(): LicenseState {
  const token = currentToken();
  const verdict = readVerdict();
  return {
    token,
    unlocked: Boolean(token && hasVerifiedPass(verdict)),
    checking: false,
    notice: verdict?.reason === 'pending'
      ? 'Verify this Night Pass once while online to unlock the archive.'
      : verdict && !verdict.valid ? 'License no longer active.' : '',
  };
}

export function storeLicense(token: string): void {
  memoryToken = token.trim();
  writeStoredValue(LICENSE_KEY, memoryToken);
  storeVerdict({ valid: false, checkedAt: 0, reason: 'pending' });
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = currentToken();
  if (!token) return { token: '', unlocked: false, checking: false, notice: '' };
  const cached = readVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) {
    return {
      token,
      unlocked: hasVerifiedPass(cached),
      checking: false,
      notice: hasVerifiedPass(cached) ? '' : cached.reason === 'pending'
        ? 'Verify this Night Pass once while online to unlock the archive.'
        : 'License no longer active.',
    };
  }

  try {
    const response = await fetch(`${API_BASE}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error('Verification service unavailable.');
    const result = await response.json() as { valid?: boolean; reason?: string };
    const verdict = { valid: result.valid === true, reason: result.reason, checkedAt: Date.now() };
    storeVerdict(verdict);
    return {
      token,
      unlocked: verdict.valid,
      checking: false,
      notice: verdict.valid ? 'Night Pass restored on this device.' : 'License no longer active.',
    };
  } catch {
    return {
      token,
      unlocked: hasVerifiedPass(cached),
      checking: false,
      notice: hasVerifiedPass(cached)
        ? 'Offline: using your last verified Night Pass.'
        : 'Could not verify this Night Pass while offline. Your free planner still works.',
    };
  }
}

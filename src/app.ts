import './styles.css';
import {
  buildRounds,
  calculateFeasibility,
  clampInt,
  createDefaultPlan,
  createSamplePlan,
  participantNames,
  planToCsv,
  validatePlan,
  type InventoryItem,
  type Plan,
} from './domain';
import {
  archivePlan,
  clearDemoData,
  clearCurrentPlan,
  deleteArchive,
  listArchives,
  loadCurrentPlan,
  saveCurrentPlan,
  type StorageScope,
} from './storage';
import {
  captureReturnedLicense,
  initialLicenseState,
  storeLicense,
  verifyLicense,
  type LicenseState,
} from './license';

const app = document.querySelector<HTMLDivElement>('#app')!;
const BUILD_ID = '1.0.2-repair-6';
const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
const demoMode = normalizedPath === '/demo' || new URL(location.href).searchParams.get('demo') === '1';
let plan: Plan | null = null;
let activeStep = 0;
let archives: Plan[] = [];
let license: LicenseState;
let saveTimer = 0;
let clockTimer = 0;
let message = '';
let messageKind: 'info' | 'error' = 'info';
let storageFailed = false;
let isOffline = !navigator.onLine;
let updateRequested = false;
let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

const numericBounds: Record<string, [number, number]> = {
  players: [2, 64],
  packsPerPlayer: [1, 99],
  componentsPerPack: [1, 999],
  componentsPerPlayer: [1, 9_999],
  reserve: [0, 99_999],
  setupMinutes: [0, 240],
  buildMinutes: [0, 240],
  rounds: [1, 20],
  roundMinutes: [1, 240],
  breakMinutes: [0, 60],
  count: [0, 1_000_000],
};

const steps = ['Inventory', 'Format', 'Schedule', 'Host sheet'];

function storageScope(): StorageScope {
  return demoMode ? 'demo' : 'real';
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function setMessage(text: string, kind: 'info' | 'error' = 'info'): void {
  message = text;
  messageKind = kind;
  const region = document.querySelector<HTMLElement>('#announcer');
  if (region) {
    region.textContent = text;
    region.dataset.kind = kind;
  }
}

function scheduleSave(): void {
  if (!plan) return;
  plan.updatedAt = new Date().toISOString();
  window.clearTimeout(saveTimer);
  const indicator = document.querySelector('#save-status');
  if (indicator) indicator.textContent = 'Saving…';
  saveTimer = window.setTimeout(async () => {
    try {
      await saveCurrentPlan(plan!, storageScope());
      storageFailed = false;
      const current = document.querySelector('#save-status');
      if (current) current.textContent = 'Saved on this device';
    } catch {
      storageFailed = true;
      setMessage('This plan could not be saved. Export a JSON backup before closing.', 'error');
    }
  }, 180);
}

function storageUnavailableNotice(): string {
  if (!storageFailed) return '';
  return `<div class="storage-banner" role="status">This browser is blocking local storage. You can still plan, print, and export a JSON backup, but this plan will not survive a refresh.</div>`;
}

function masthead(): string {
  return `<header class="masthead">
    <a class="brand" href="/" aria-label="Limited Night Planner home">
      <img src="/icon.svg" width="40" height="40" alt="" />
      <span>Limited Night Planner</span>
    </a>
    <nav class="masthead-nav" aria-label="Primary"><a href="/demo/">Demo</a><a href="/privacy/">Privacy</a></nav>
    ${demoMode ? '<span class="service-label">Sample route</span>' : plan ? `<span class="save-state" id="save-status">${storageFailed ? 'Save needs attention' : 'Saved on this device'}</span>` : '<span class="service-label">Local night service</span>'}
  </header>`;
}

function footer(): string {
  return `<footer class="footer">
    <div><strong>Plan a casual limited event from mixed components.</strong><br />Your plan stays in this browser. Poster artwork is original AI-generated imagery.</div>
    <nav aria-label="Site links"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://github.com/B-Divyesh/sf-limited-night-planner" rel="noreferrer">Source</a></nav>
    <small>Built by Param Factory · Build ${BUILD_ID}</small>
  </footer>`;
}

function shell(content: string): string {
  return `${demoMode ? '<div class="demo-banner"><p role="status"><strong>Demo — sample data, nothing is saved</strong><small>This demo uses a separate browser space from your plans.</small></p><span class="demo-actions"><button class="button button-secondary" data-action="reset-demo">Reset demo</button><button class="button button-primary" data-action="start-real">Start for real</button></span></div>' : ''}
    ${isOffline ? '<div class="offline-banner" role="status">Offline service · your saved planner and timer still work.</div>' : ''}
    ${storageUnavailableNotice()}
    ${masthead()}
    ${content}
    <div id="announcer" class="toast ${message ? 'is-visible' : ''}" data-kind="${messageKind}" role="status" aria-live="polite">${escapeHtml(message)}</div>
    ${footer()}`;
}

function renderLanding(): void {
  app.innerHTML = shell(`<main id="main" class="landing" tabindex="-1">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Planner for casual limited events</p>
        <h1>Plan a fair<br /><em>tabletop event.</em></h1>
        <p class="hero-lead">For hosts using mixed components, build a fair schedule before friends arrive. No card database or venue Wi-Fi needed.</p>
        <div class="hero-actions"><a class="button button-primary" href="/demo/">Try it with sample data <span aria-hidden="true">→</span></a><p>See a ready five-player host sheet.</p></div>
        <button class="button button-secondary start-real-button" data-action="start-plan">Start a real plan</button>
        <ul class="plain-facts"><li>Works offline after the first visit.</li><li>Plan data stays in this browser.</li><li>Planning, timers, printing, and exports stay free.</li></ul>
      </div>
      <picture class="hero-art">
        <source srcset="/assets/midnight-route-768.webp 768w, /assets/midnight-route-1536.webp 1536w" sizes="(max-width: 860px) calc(100vw - 24px), 60vw" type="image/webp" />
        <img src="/assets/midnight-route-1536.webp" srcset="/assets/midnight-route-768.webp 768w, /assets/midnight-route-1536.webp 1536w" sizes="(max-width: 860px) calc(100vw - 24px), 60vw" width="1536" height="1024" alt="Blank tabletop components traveling along brass routes into four equal player kits" fetchpriority="high" decoding="async" />
      </picture>
    </section>
    <section class="promise" aria-labelledby="promise-title">
      <p class="route-number" aria-hidden="true">04</p>
      <div><p class="eyebrow">Four steps</p><h2 id="promise-title">How the planner works</h2></div>
      <ol>
        <li><span>01</span><strong>Count components</strong><small>Include only groups that can mix.</small></li>
        <li><span>02</span><strong>Choose a pool</strong><small>See whether the count covers each player.</small></li>
        <li><span>03</span><strong>Set seating</strong><small>Avoid repeat opponents for one round-robin cycle.</small></li>
        <li><span>04</span><strong>Run the event</strong><small>Use the timer and print the host sheet.</small></li>
      </ol>
    </section>
  </main>`);
  bindEvents();
}

function routeNav(): string {
  return `<nav class="route-nav" aria-label="Planner steps"><ol>${steps.map((step, index) => `
    <li class="${index === activeStep ? 'current' : ''} ${index < activeStep ? 'complete' : ''}">
      <button data-action="step" data-step="${index}" ${index === activeStep ? 'aria-current="step"' : ''}>
        <span>${String(index + 1).padStart(2, '0')}</span>${step}
      </button>
    </li>`).join('')}</ol></nav>`;
}

function renderPlanner(): void {
  if (!plan) return renderLanding();
  const subtitle = activeStep === 0 ? 'Count the pieces you can really use.'
    : activeStep === 1 ? 'Choose a fair deal before anyone sits down.'
      : activeStep === 2 ? 'Keep tables moving without improvising.'
        : 'One page for every transition.';
  const views = [inventoryView, formatView, scheduleView, hostSheetView];
  app.innerHTML = shell(`${routeNav()}<main id="main" class="planner-shell" tabindex="-1">
    <div class="page-heading"><div><p class="eyebrow">Stop ${String(activeStep + 1).padStart(2, '0')} · ${steps[activeStep]}</p><h1>${escapeHtml(plan.eventName || 'Untitled limited night')}</h1><p>${subtitle}</p></div><button class="button button-quiet danger-link" data-action="${demoMode ? 'reset-demo' : 'reset-plan'}">${demoMode ? 'Reset sample' : 'Start over'}</button></div>
    ${views[activeStep]()}
    <div class="step-actions">
      ${activeStep > 0 ? '<button class="button button-secondary" data-action="previous">← Previous stop</button>' : '<span></span>'}
      ${activeStep < 3 ? `<button class="button button-primary" data-action="next">Next: ${steps[activeStep + 1]} →</button>` : '<button class="button button-primary" data-action="print">Print host sheet</button>'}
    </div>
  </main>`);
  bindEvents();
}

function field(label: string, name: string, value: string | number, type = 'text', attrs = ''): string {
  const validation = type === 'number'
    ? `<small class="field-validation" id="${name}-validation" data-validation="${name}" aria-live="polite"></small>`
    : '';
  return `<label class="field"><span>${label}</span><input type="${type}" name="${name}" data-field="${name}" value="${escapeHtml(value)}" ${validation ? `aria-describedby="${name}-validation"` : ''} ${attrs} />${validation}</label>`;
}

function inventoryView(): string {
  const feasibility = calculateFeasibility(plan!);
  const items = plan!.inventory.length ? plan!.inventory.map((item, index) => inventoryRow(item, index)).join('') : `
    <div class="empty-state"><span class="empty-mark" aria-hidden="true">＋</span><h3>No components counted yet</h3><p>Add each box, bundle, or compatible group. You can exclude doubtful groups without deleting the count.</p><button class="button button-secondary" data-action="add-item">Add first group</button></div>`;
  return `<section class="work-grid">
    <div class="work-main">
      <section aria-labelledby="details-title"><div class="section-heading"><div><p class="eyebrow">Departure</p><h2 id="details-title">Night details</h2></div></div>
        <div class="field-grid">${field('Event name', 'eventName', plan!.eventName, 'text', 'maxlength="80" required')}${field('Date', 'eventDate', plan!.eventDate, 'date')}${field('Doors open', 'startTime', plan!.startTime, 'time')}${field('Players', 'players', plan!.players, 'number', 'min="2" max="64" inputmode="numeric"')}</div>
        <label class="field"><span>Player names <small>optional, one per line</small></span><textarea data-field="playerNames" rows="4" placeholder="Avery&#10;Morgan&#10;Sam&#10;Jo">${escapeHtml(plan!.playerNames.join('\n'))}</textarea></label>
      </section>
      <section aria-labelledby="inventory-title"><div class="section-heading"><div><p class="eyebrow">Arrivals board</p><h2 id="inventory-title">Usable inventory</h2></div><button class="button button-secondary" data-action="add-item">＋ Add group</button></div>
        <p class="section-intro">Count broad groups; use the note for uncertainty. Uncheck anything that may not mix safely.</p>
        <div class="inventory-list">${items}</div>
      </section>
    </div>
    ${feasibilityCard(feasibility)}
  </section>`;
}

function inventoryRow(item: InventoryItem, index: number): string {
  return `<div class="inventory-row" data-item-id="${escapeHtml(item.id)}">
    <label class="check-field"><input type="checkbox" data-item-field="included" data-index="${index}" ${item.included ? 'checked' : ''} /><span class="check-box" aria-hidden="true"></span><span class="sr-only">Include group ${index + 1}</span></label>
    <label class="field compact"><span>Group name</span><input data-item-field="name" data-index="${index}" value="${escapeHtml(item.name)}" maxlength="80" /></label>
    <label class="field compact count"><span>Count</span><input type="number" data-item-field="count" data-index="${index}" value="${item.count}" min="0" max="1000000" inputmode="numeric" aria-describedby="count-${index}-validation" /><small class="field-validation" id="count-${index}-validation" data-validation="count-${index}" aria-live="polite"></small></label>
    <label class="field compact note"><span>Compatibility note</span><input data-item-field="note" data-index="${index}" value="${escapeHtml(item.note)}" maxlength="300" placeholder="e.g. different backs" /></label>
    <button class="icon-button" data-action="remove-item" data-index="${index}" aria-label="Remove ${escapeHtml(item.name || `group ${index + 1}`)}">×</button>
  </div>`;
}

function feasibilityCard(result = calculateFeasibility(plan!)): string {
  const labels = {
    empty: ['Waiting for a count', 'Add inventory to test this plan.'],
    ready: ['Ready with room', `${result.difference.toLocaleString()} components remain after the reserve.`],
    tight: ['Ready, but tight', `Only ${result.difference.toLocaleString()} components remain after the reserve.`],
    short: ['Short for this deal', `Find ${Math.abs(result.difference).toLocaleString()} more or reduce the pool.`],
  } as const;
  return `<aside class="departure-board" aria-labelledby="board-title">
    <p class="eyebrow">Live departure board</p><h2 id="board-title">${labels[result.status][0]}</h2><p class="status-copy">${labels[result.status][1]}</p>
    <dl><div><dt>Usable</dt><dd>${result.available.toLocaleString()}</dd></div><div><dt>Needed</dt><dd>${result.required.toLocaleString()}</dd></div><div><dt>Per player</dt><dd>${result.perPlayer.toLocaleString()}</dd></div><div class="difference ${result.status}"><dt>${result.difference < 0 ? 'Short' : 'Spare'}</dt><dd>${Math.abs(result.difference).toLocaleString()}</dd></div></dl>
    <p class="board-note">Counts update from checked groups. “Needed” includes your reserve.</p>
  </aside>`;
}

function formatView(): string {
  const result = calculateFeasibility(plan!);
  const uniqueRounds = plan!.players % 2 === 0 ? plan!.players - 1 : plan!.players;
  return `<section class="work-grid">
    <div class="work-main">
      <section aria-labelledby="deal-title"><div class="section-heading"><div><p class="eyebrow">Assembly route</p><h2 id="deal-title">How will you divide the pile?</h2></div></div>
        <div class="choice-grid" role="radiogroup" aria-label="Pool format">
          <label class="choice"><input type="radio" name="mode" data-field="mode" value="packs" ${plan!.mode === 'packs' ? 'checked' : ''}/><span><strong>Make packs</strong><small>Equal sealed bundles for each player.</small></span></label>
          <label class="choice"><input type="radio" name="mode" data-field="mode" value="pools" ${plan!.mode === 'pools' ? 'checked' : ''}/><span><strong>Deal direct pools</strong><small>Skip packs and give each player one pool.</small></span></label>
        </div>
        <div class="field-grid three">${plan!.mode === 'packs'
          ? `${field('Packs per player', 'packsPerPlayer', plan!.packsPerPlayer, 'number', 'min="1" max="99"')}${field('Components per pack', 'componentsPerPack', plan!.componentsPerPack, 'number', 'min="1" max="999"')}`
          : field('Components per player', 'componentsPerPlayer', plan!.componentsPerPlayer, 'number', 'min="1" max="9999"')}
          ${field('Shared reserve', 'reserve', plan!.reserve, 'number', 'min="0" max="99999"')}
        </div>
      </section>
      <section aria-labelledby="timing-title"><div class="section-heading"><div><p class="eyebrow">Working timetable</p><h2 id="timing-title">Set the pace</h2></div></div>
        <div class="field-grid three">${field('Setup minutes', 'setupMinutes', plan!.setupMinutes, 'number', 'min="0" max="240"')}${field('Build minutes', 'buildMinutes', plan!.buildMinutes, 'number', 'min="0" max="240"')}${field('Rounds', 'rounds', plan!.rounds, 'number', 'min="1" max="20"')}${field('Round minutes', 'roundMinutes', plan!.roundMinutes, 'number', 'min="1" max="240"')}${field('Changeover minutes', 'breakMinutes', plan!.breakMinutes, 'number', 'min="0" max="60"')}</div>
        <p id="repeat-opponent-guidance" class="field-help" role="status" aria-live="polite">${plan!.rounds > uniqueRounds ? `With ${plan!.players} players, opponents begin repeating after round ${uniqueRounds}.` : ''}</p>
      </section>
      <section aria-labelledby="notes-title"><div class="section-heading"><div><p class="eyebrow">Exception desk</p><h2 id="notes-title">Compatibility and house notes</h2></div></div>
        <label class="field"><span>What must the host check?</span><textarea data-field="compatibilityNotes" rows="6" placeholder="Sleeve groups with different backs. Keep the six marked pieces together. Explain the replacement-token rule before building.">${escapeHtml(plan!.compatibilityNotes)}</textarea></label>
        <p class="field-help">Write only your own notes. This planner does not reproduce publisher rules.</p>
      </section>
    </div>
    ${feasibilityCard(result)}
  </section>`;
}

function timerRemaining(): number {
  if (!plan) return 0;
  if (plan.timer.running && plan.timer.endsAt) return Math.max(0, Math.ceil((plan.timer.endsAt - Date.now()) / 1000));
  return Math.max(0, plan.timer.remainingSeconds);
}

function formatDuration(seconds: number): string {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function scheduleView(): string {
  const rounds = buildRounds(plan!);
  const remaining = timerRemaining();
  const currentRound = Math.min(plan!.timer.roundIndex, Math.max(0, rounds.length - 1));
  const total = plan!.roundMinutes * 60;
  const percent = total ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0;
  return `<section class="schedule-layout">
    <section class="timer-panel" aria-labelledby="timer-title">
      <p class="eyebrow">Live night mode</p><h2 id="timer-title">${rounds.length ? `Round ${currentRound + 1}` : 'Round timer'}</h2>
      <div class="timer-clock" role="timer" aria-live="off" aria-label="${Math.floor(remaining / 60)} minutes ${remaining % 60} seconds remaining">${formatDuration(remaining)}</div>
      <div class="timer-track" aria-hidden="true"><span style="width:${percent}%"></span></div>
      <div class="timer-actions">
        <button class="button button-primary" data-action="toggle-timer">${plan!.timer.running ? 'Pause timer' : remaining === 0 ? 'Restart round' : 'Start timer'}</button>
        <button class="button button-secondary" data-action="reset-timer">Reset</button>
        <button class="button button-secondary" data-action="next-round" ${currentRound >= rounds.length - 1 ? 'disabled' : ''}>Next round</button>
      </div>
      <p class="timer-note">The timer continues if you switch tabs. Keep this screen awake using your device settings.</p>
    </section>
    <section aria-labelledby="schedule-title"><div class="section-heading"><div><p class="eyebrow">Generated route</p><h2 id="schedule-title">Rounds and seating</h2></div></div>
      ${rounds.length ? `<div class="round-list">${rounds.map((round) => roundCard(round, currentRound)).join('')}</div>` : '<div class="empty-state"><h3>Add a valid date and time</h3><p>Return to Inventory to set when doors open.</p></div>'}
    </section>
  </section>`;
}

function roundCard(round: ReturnType<typeof buildRounds>[number], currentRound = -1): string {
  return `<article class="round-card ${round.round - 1 === currentRound ? 'current' : ''}">
    <header><div><span>Round ${round.round}</span><strong>${round.startsAt}–${round.endsAt}</strong></div>${round.round - 1 === currentRound ? '<b>Current</b>' : ''}</header>
    <ul>${round.pairings.map((pair) => `<li><span>${pair.bye ? 'Bye' : `Table ${pair.table}`}</span><strong>${escapeHtml(pair.playerA === 'BYE' ? pair.playerB : pair.playerA)}${pair.bye ? ' sits out' : ` <i>vs</i> ${escapeHtml(pair.playerB)}`}</strong></li>`).join('')}</ul>
  </article>`;
}

function hostSheetView(): string {
  const result = calculateFeasibility(plan!);
  const rounds = buildRounds(plan!);
  return `<section class="host-page">
    <section class="print-sheet" aria-labelledby="sheet-title">
      <header class="sheet-header"><div><p class="eyebrow">Limited night · host route</p><h2 id="sheet-title">${escapeHtml(plan!.eventName)}</h2><p>${escapeHtml(plan!.eventDate)} · Doors ${escapeHtml(plan!.startTime)} · ${plan!.players} players</p></div><div class="sheet-status ${result.status}"><span>${result.difference >= 0 ? 'Ready' : 'Short'}</span><strong>${result.available}/${result.required}</strong><small>usable / needed</small></div></header>
      <section class="checklist" aria-labelledby="checklist-title"><h3 id="checklist-title">Before departure</h3><ul><li><span></span>Count ${result.required.toLocaleString()} components into ${plan!.mode === 'packs' ? `${plan!.players * plan!.packsPerPlayer} packs of ${plan!.componentsPerPack}` : `${plan!.players} pools of ${plan!.componentsPerPlayer}`}.</li><li><span></span>Set aside the ${plan!.reserve.toLocaleString()}-component reserve.</li><li><span></span>Confirm every included inventory group below.</li><li><span></span>Read compatibility notes before players build.</li><li><span></span>Start the first round at ${rounds[0]?.startsAt ?? 'the planned time'}.</li></ul></section>
      <div class="sheet-columns"><section><h3>Inventory manifest</h3><ul class="manifest-list">${plan!.inventory.filter((item) => item.included).map((item) => `<li><span>□ ${escapeHtml(item.name || 'Unnamed group')}</span><strong>${item.count.toLocaleString()}</strong>${item.note ? `<small>${escapeHtml(item.note)}</small>` : ''}</li>`).join('') || '<li>No groups included.</li>'}</ul></section>
      <section><h3>Exception notes</h3><p class="preserve-lines">${escapeHtml(plan!.compatibilityNotes) || 'No compatibility notes entered.'}</p><h3>Host notes</h3><label class="field print-notes"><span class="sr-only">Host notes</span><textarea data-field="hostNotes" rows="5" placeholder="Door code, snack break, borrowed pieces…">${escapeHtml(plan!.hostNotes)}</textarea></label></section></div>
      <section><h3>Round route</h3><div class="print-rounds">${rounds.map((round) => roundCard(round)).join('')}</div></section>
    </section>
    <aside class="host-tools" aria-labelledby="tools-title"><p class="eyebrow">Dispatch desk</p><h2 id="tools-title">Take the plan with you</h2><button class="button button-primary" data-action="print">Print host sheet</button><button class="button button-secondary" data-action="export-json">Export JSON backup</button><button class="button button-secondary" data-action="export-csv">Export CSV</button><label class="button button-secondary file-button">Import JSON<input type="file" id="import-file" accept="application/json,.json" /></label><p>Exports are always free and work offline.</p>
      ${nightPassView()}
    </aside>
  </section>`;
}

function nightPassView(): string {
  if (demoMode) {
    return `<section class="night-pass"><p class="eyebrow">Sample data</p><h3>Demo stays separate</h3><p>Demo changes are never added to your real planner or archive.</p></section>`;
  }
  if (license.unlocked) {
    return `<section class="night-pass unlocked"><p class="eyebrow">Night Pass · unlocked</p><h3>Keep a plan archive</h3><p>Save reusable snapshots on this device.</p><button class="button button-secondary" data-action="archive">Archive current plan</button>
      <ul class="archive-list">${archives.map((item) => `<li><button data-action="load-archive" data-id="${item.id}"><strong>${escapeHtml(item.eventName)}</strong><small>${escapeHtml(item.eventDate)}</small></button><button class="icon-button" data-action="delete-archive" data-id="${item.id}" aria-label="Delete archived ${escapeHtml(item.eventName)}">×</button></li>`).join('') || '<li class="archive-empty">No archived plans yet.</li>'}</ul>${license.notice ? `<p class="license-notice">${escapeHtml(license.notice)}</p>` : ''}</section>`;
  }
  return `<section class="night-pass"><p class="eyebrow">Night Pass</p><h3>Archive access</h3><p>New Night Pass purchases are not available yet. Planning, timers, printing, and exports stay free.</p><details><summary>Have an existing license? Restore it</summary><label class="field compact"><span>License token</span><input id="license-token" autocomplete="off" /></label><button class="button button-secondary" data-action="restore-license">Verify license</button></details>${license.notice ? `<p class="license-notice">${escapeHtml(license.notice)}</p>` : ''}<p class="legal-note">Sociobot/Dodo verifies existing licenses. <a href="/terms/">Terms</a> apply.</p></section>`;
}

function updatePlanField(name: string, rawValue: string): void {
  if (!plan) return;
  const numeric: (keyof Plan)[] = ['players', 'packsPerPlayer', 'componentsPerPack', 'componentsPerPlayer', 'reserve', 'setupMinutes', 'buildMinutes', 'rounds', 'roundMinutes', 'breakMinutes'];
  if (name === 'playerNames') plan.playerNames = rawValue.split('\n').map((value) => value.trim()).filter(Boolean).slice(0, 64);
  else if (name === 'mode' && (rawValue === 'packs' || rawValue === 'pools')) plan.mode = rawValue;
  else if (numeric.includes(name as keyof Plan)) {
    const [min, max] = numericBounds[name];
    (plan as unknown as Record<string, number>)[name] = clampInt(rawValue, min, max);
  } else if (['eventName', 'eventDate', 'startTime', 'compatibilityNotes', 'hostNotes'].includes(name)) {
    (plan as unknown as Record<string, string>)[name] = rawValue;
  }
  scheduleSave();
}

function refreshRepeatOpponentGuidance(): void {
  const guidance = document.querySelector<HTMLElement>('#repeat-opponent-guidance');
  if (!guidance || !plan) return;
  const uniqueRounds = plan.players % 2 === 0 ? plan.players - 1 : plan.players;
  guidance.textContent = plan.rounds > uniqueRounds
    ? `With ${plan.players} players, opponents begin repeating after round ${uniqueRounds}.`
    : '';
}

function reflectNumericValidation(input: HTMLInputElement, key: string, rawValue: string): void {
  const [min, max] = numericBounds[key];
  const value = clampInt(rawValue, min, max);
  const parsed = Number.parseInt(rawValue, 10);
  const valid = Number.isFinite(parsed) && parsed >= min && parsed <= max;
  const message = valid ? '' : `${input.labels?.[0]?.querySelector('span')?.textContent ?? 'This value'} must be between ${min.toLocaleString()} and ${max.toLocaleString()}. Using ${value.toLocaleString()}.`;
  input.value = String(value);
  input.setAttribute('aria-invalid', String(!valid));
  const suffix = input.dataset.index === undefined ? key : `${key}-${input.dataset.index}`;
  const feedback = document.querySelector<HTMLElement>(`[data-validation="${suffix}"]`);
  if (feedback) feedback.textContent = message;
}

function bindEvents(): void {
  app.querySelectorAll<HTMLElement>('[data-action]').forEach((element) => element.addEventListener('click', handleAction));
  app.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-field]').forEach((element) => {
    const eventName = element instanceof HTMLInputElement && element.type === 'radio' ? 'change' : 'input';
    element.addEventListener(eventName, () => {
      updatePlanField(element.dataset.field!, element.value);
      if (element instanceof HTMLInputElement && element.type === 'radio') renderPlanner();
      else if (element instanceof HTMLInputElement && element.type === 'number') {
        reflectNumericValidation(element, element.dataset.field!, element.value);
        refreshBoard();
        refreshRepeatOpponentGuidance();
      }
    });
  });
  app.querySelectorAll<HTMLInputElement>('[data-item-field]').forEach((element) => {
    const requiresRender = element.dataset.itemField === 'included';
    element.addEventListener(requiresRender ? 'change' : 'input', () => {
      if (!plan) return;
      const item = plan.inventory[Number(element.dataset.index)];
      if (!item) return;
      const property = element.dataset.itemField as 'name' | 'note' | 'count' | 'included';
      if (property === 'included') item.included = element.checked;
      else if (property === 'count') item.count = clampInt(element.value, 0, 1_000_000);
      else item[property] = element.value;
      scheduleSave();
      if (requiresRender) renderPlanner();
      else if (property === 'count') {
        reflectNumericValidation(element, 'count', element.value);
        refreshBoard();
      }
    });
  });
  document.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', importFile);
}

function refreshBoard(): void {
  const board = document.querySelector<HTMLElement>('.departure-board');
  if (board && plan) board.outerHTML = feasibilityCard();
}

async function handleAction(event: Event): Promise<void> {
  const target = event.currentTarget as HTMLElement;
  const action = target.dataset.action;
  if (action === 'start-plan') {
    plan = createDefaultPlan();
    try {
      await saveCurrentPlan(plan, storageScope());
      storageFailed = false;
    } catch {
      storageFailed = true;
      setMessage('This browser is blocking local storage. You can still plan and export a JSON backup, but this plan will not survive a refresh.', 'error');
    }
    renderPlanner();
  } else if (action === 'step') {
    activeStep = Number(target.dataset.step);
    renderPlanner();
    document.querySelector('h1')?.focus?.();
  } else if (action === 'next' || action === 'previous') {
    activeStep = Math.max(0, Math.min(3, activeStep + (action === 'next' ? 1 : -1)));
    renderPlanner();
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  } else if (action === 'add-item') {
    plan?.inventory.push({ id: crypto.randomUUID(), name: `Group ${(plan?.inventory.length ?? 0) + 1}`, count: 0, included: true, note: '' });
    scheduleSave(); renderPlanner();
    // Focus synchronously. A deferred rAF focus can land after a user starts
    // typing into Count and redirect the typed value to the group-name field.
    app.querySelector<HTMLInputElement>('.inventory-row:last-child input[data-item-field="name"]')?.select();
  } else if (action === 'remove-item') {
    plan?.inventory.splice(Number(target.dataset.index), 1); scheduleSave(); renderPlanner();
  } else if (action === 'reset-plan') {
    if (confirm(`Start over and remove “${plan?.eventName}” from this device? Export first if you need a copy.`)) {
      try {
        await clearCurrentPlan(storageScope());
        storageFailed = false;
      } catch {
        storageFailed = true;
        setMessage('This browser is blocking local storage. The plan was cleared only in this tab.', 'error');
      }
      plan = null; activeStep = 0; renderLanding();
    }
  } else if (action === 'toggle-timer') toggleTimer();
  else if (action === 'reset-timer') resetTimer();
  else if (action === 'next-round') nextRound();
  else if (action === 'print') window.print();
  else if (action === 'export-json') download(`${fileSlug()}-plan.json`, JSON.stringify(plan, null, 2), 'application/json');
  else if (action === 'export-csv') download(`${fileSlug()}-host-sheet.csv`, planToCsv(plan!), 'text/csv;charset=utf-8');
  else if (action === 'restore-license') await restoreLicense();
  else if (action === 'archive') {
    try {
      await archivePlan(plan!, storageScope());
      archives = await listArchives(storageScope());
      setMessage('Plan archived on this device.');
    } catch {
      storageFailed = true;
      setMessage('This browser is blocking local storage. Archives are unavailable, so export a JSON backup instead.', 'error');
    }
    renderPlanner();
  } else if (action === 'load-archive') {
    const archived = archives.find((item) => item.id === target.dataset.id);
    if (archived) {
      plan = structuredClone(archived);
      plan.id = crypto.randomUUID();
      try {
        await saveCurrentPlan(plan, storageScope());
        setMessage('Archived plan loaded as your current plan.');
      } catch {
        storageFailed = true;
        setMessage('This browser is blocking local storage. The archive is open for this tab only, so export a JSON backup before refreshing.', 'error');
      }
      renderPlanner();
    }
  } else if (action === 'delete-archive') {
    try {
      await deleteArchive(target.dataset.id!, storageScope());
      archives = await listArchives(storageScope());
      setMessage('Archived plan removed.');
    } catch {
      storageFailed = true;
      setMessage('This browser is blocking local storage. That archive could not be removed.', 'error');
    }
    renderPlanner();
  } else if (action === 'apply-update') {
    updateRequested = true;
    const worker = serviceWorkerRegistration?.waiting ?? navigator.serviceWorker.controller;
    if (worker) worker.postMessage({ type: 'SKIP_WAITING' });
    else {
      updateRequested = false;
      setMessage('Checking for the fresh version again.');
      void serviceWorkerRegistration?.update();
    }
  } else if (action === 'reset-demo') {
    plan = createSamplePlan();
    activeStep = 3;
    try {
      await saveCurrentPlan(plan, 'demo');
      storageFailed = false;
      setMessage('Demo reset to the sample night.');
    } catch {
      storageFailed = true;
      setMessage('The sample night reset for this tab. Browser storage is unavailable.', 'error');
    }
    renderPlanner();
  } else if (action === 'start-real') {
    try { await clearDemoData(); } catch { /* Leaving the demo never blocks the real planner. */ }
    location.assign('/');
  }
}

function toggleTimer(): void {
  if (!plan) return;
  const remaining = timerRemaining();
  if (plan.timer.running) {
    plan.timer.remainingSeconds = remaining;
    plan.timer.running = false;
    plan.timer.endsAt = null;
  } else {
    plan.timer.remainingSeconds = remaining || plan.roundMinutes * 60;
    plan.timer.endsAt = Date.now() + plan.timer.remainingSeconds * 1000;
    plan.timer.running = true;
  }
  scheduleSave(); startClock(); renderPlanner();
}

function resetTimer(): void {
  if (!plan) return;
  plan.timer = { ...plan.timer, remainingSeconds: plan.roundMinutes * 60, running: false, endsAt: null };
  scheduleSave(); startClock(); renderPlanner();
}

function nextRound(): void {
  if (!plan) return;
  plan.timer = { roundIndex: Math.min(plan.timer.roundIndex + 1, plan.rounds - 1), remainingSeconds: plan.roundMinutes * 60, running: false, endsAt: null };
  scheduleSave(); renderPlanner();
}

function startClock(): void {
  window.clearInterval(clockTimer);
  if (!plan?.timer.running) return;
  clockTimer = window.setInterval(() => {
    if (!plan?.timer.running || activeStep !== 2) return;
    const remaining = timerRemaining();
    if (remaining <= 0) {
      plan.timer.running = false; plan.timer.remainingSeconds = 0; plan.timer.endsAt = null;
      scheduleSave(); setMessage(`Round ${plan.timer.roundIndex + 1} is complete.`); renderPlanner(); startClock();
    } else {
      const clock = document.querySelector('.timer-clock');
      if (clock) { clock.textContent = formatDuration(remaining); clock.setAttribute('aria-label', `${Math.floor(remaining / 60)} minutes ${remaining % 60} seconds remaining`); }
      const bar = document.querySelector<HTMLElement>('.timer-track span');
      if (bar) bar.style.width = `${(remaining / (plan.roundMinutes * 60)) * 100}%`;
    }
  }, 1000);
}

async function restoreLicense(): Promise<void> {
  const input = document.querySelector<HTMLInputElement>('#license-token');
  const token = input?.value.trim() ?? '';
  if (!token) return setMessage('Paste the license token from your receipt.', 'error');
  storeLicense(token);
  setMessage('Checking license…');
  license = await verifyLicense(true);
  if (license.unlocked) {
    try {
      archives = await listArchives(storageScope());
    } catch {
      storageFailed = true;
      setMessage('This browser is blocking local storage. The Night Pass archive is unavailable on this device.', 'error');
    }
  }
  renderPlanner();
}

async function importFile(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    if (file.size > 2_000_000) throw new Error('That file is too large. Choose a planner JSON export under 2 MB.');
    const source = await file.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(source);
    } catch {
      throw new Error('This file is not valid planner JSON. Choose a JSON backup exported by Limited Night Planner.');
    }
    const imported = validatePlan(parsed);
    plan = imported;
    try {
      await saveCurrentPlan(plan, storageScope());
      setMessage('Plan imported and saved on this device.');
    } catch {
      storageFailed = true;
      setMessage('This browser is blocking local storage. The imported plan is open for this tab only, so export a JSON backup before refreshing.', 'error');
    }
    renderPlanner();
  } catch (error) {
    setMessage(error instanceof Error ? error.message : 'Could not import that plan.', 'error');
    input.value = '';
  }
}

function fileSlug(): string {
  return (plan?.eventName || 'limited-night').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50) || 'limited-night';
}

function download(filename: string, contents: string, type: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0); setMessage(`${filename} downloaded.`);
}

function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  const register = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      serviceWorkerRegistration = registration;
      const offerUpdate = () => {
        if (!registration.waiting || !navigator.serviceWorker.controller) return;
        message = 'A fresh timetable is ready.';
        const region = document.querySelector('#announcer');
        if (region) region.innerHTML = 'A fresh version is ready. <button data-action="apply-update">Update now</button>';
        region?.classList.add('is-visible');
        region?.querySelector('[data-action]')?.addEventListener('click', handleAction);
      };
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed') offerUpdate();
        });
      });
      offerUpdate();
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (updateRequested) location.reload();
      });
    } catch { /* The app remains fully usable without installation support. */ }
  };
  if (document.readyState === 'complete') void register();
  else window.addEventListener('load', register, { once: true });
}

async function init(): Promise<void> {
  if (!demoMode) captureReturnedLicense();
  license = demoMode
    ? { token: '', unlocked: false, checking: false, notice: '' }
    : initialLicenseState();
  if (demoMode) document.title = 'Demo — Limited Night Planner';
  app.innerHTML = shell('<main id="main" class="loading" tabindex="-1"><h1>Opening the night desk…</h1><p>Reading the plan saved on this device.</p></main>');
  try { plan = await loadCurrentPlan(storageScope()); } catch { storageFailed = true; }
  if (demoMode) activeStep = 3;
  if (demoMode && !plan) {
    plan = createSamplePlan();
    try { await saveCurrentPlan(plan, 'demo'); } catch { storageFailed = true; }
  }
  if (license.unlocked) archives = await listArchives(storageScope()).catch(() => []);
  if (plan?.timer.running && timerRemaining() <= 0) {
    plan.timer.running = false; plan.timer.remainingSeconds = 0; plan.timer.endsAt = null;
  }
  plan ? renderPlanner() : renderLanding();
  startClock(); registerServiceWorker();
  addEventListener('online', () => { isOffline = false; message = 'Back online.'; plan ? renderPlanner() : renderLanding(); });
  addEventListener('offline', () => { isOffline = true; message = ''; plan ? renderPlanner() : renderLanding(); });
  try {
    await fetch(`/manifest.webmanifest?connectivity=${Date.now()}`, { cache: 'no-store' });
    isOffline = false;
  } catch {
    isOffline = true;
    plan ? renderPlanner() : renderLanding();
  }
  if (!demoMode && license.token) {
    license = await verifyLicense();
    if (license.unlocked) archives = await listArchives(storageScope()).catch(() => []);
    if (plan && activeStep === 3) renderPlanner();
  }
}

void init();

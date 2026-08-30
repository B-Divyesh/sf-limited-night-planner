export type AssemblyMode = 'packs' | 'pools';

export interface InventoryItem {
  id: string;
  name: string;
  count: number;
  included: boolean;
  note: string;
}

export interface TimerState {
  roundIndex: number;
  remainingSeconds: number;
  running: boolean;
  endsAt: number | null;
}

export interface Plan {
  version: 1;
  id: string;
  updatedAt: string;
  eventName: string;
  eventDate: string;
  startTime: string;
  players: number;
  playerNames: string[];
  inventory: InventoryItem[];
  mode: AssemblyMode;
  packsPerPlayer: number;
  componentsPerPack: number;
  componentsPerPlayer: number;
  reserve: number;
  setupMinutes: number;
  buildMinutes: number;
  rounds: number;
  roundMinutes: number;
  breakMinutes: number;
  compatibilityNotes: string;
  hostNotes: string;
  timer: TimerState;
}

export interface Feasibility {
  available: number;
  required: number;
  difference: number;
  status: 'empty' | 'ready' | 'tight' | 'short';
  perPlayer: number;
}

export interface Pairing {
  table: number;
  playerA: string;
  playerB: string;
  bye: boolean;
}

export interface RoundPlan {
  round: number;
  startsAt: string;
  endsAt: string;
  pairings: Pairing[];
}

const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

export function todayLocal(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function createDefaultPlan(): Plan {
  return {
    version: 1,
    id: uid(),
    updatedAt: new Date().toISOString(),
    eventName: 'Friday night limited',
    eventDate: todayLocal(),
    startTime: '19:00',
    players: 4,
    playerNames: [],
    inventory: [],
    mode: 'packs',
    packsPerPlayer: 3,
    componentsPerPack: 15,
    componentsPerPlayer: 45,
    reserve: 12,
    setupMinutes: 15,
    buildMinutes: 30,
    rounds: 3,
    roundMinutes: 45,
    breakMinutes: 5,
    compatibilityNotes: '',
    hostNotes: '',
    timer: { roundIndex: 0, remainingSeconds: 45 * 60, running: false, endsAt: null },
  };
}

/**
 * This sample is intentionally opinionated enough to show the entire planner
 * on first paint. It is only ever stored in the dedicated demo database.
 */
export function createSamplePlan(): Plan {
  const plan = createDefaultPlan();
  plan.eventName = 'Saturday mixed box night';
  plan.eventDate = '2026-10-17';
  plan.startTime = '19:00';
  plan.players = 5;
  plan.playerNames = ['Avery', 'Morgan', 'Sam', 'Jo', 'Kai'];
  plan.inventory = [
    {
      id: uid(),
      name: 'Compatible mixed components',
      count: 300,
      included: true,
      note: 'Checked for matching backs and sleeves',
    },
    {
      id: uid(),
      name: 'Different-back reserve box',
      count: 80,
      included: false,
      note: 'Keep out unless sleeved',
    },
  ];
  plan.mode = 'pools';
  plan.componentsPerPlayer = 45;
  plan.reserve = 12;
  plan.setupMinutes = 15;
  plan.buildMinutes = 30;
  plan.rounds = 5;
  plan.roundMinutes = 45;
  plan.breakMinutes = 5;
  plan.compatibilityNotes = 'Keep the different-back box out. Put shared tokens beside the host sheet.';
  plan.hostNotes = 'Ask players to return unused sleeves after the final round.';
  plan.timer = { roundIndex: 0, remainingSeconds: 45 * 60, running: false, endsAt: null };
  return plan;
}

export function clampInt(value: unknown, min: number, max: number): number {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}

export function calculateFeasibility(plan: Plan): Feasibility {
  const available = plan.inventory
    .filter((item) => item.included)
    .reduce((total, item) => total + clampInt(item.count, 0, 1_000_000), 0);
  const perPlayer = plan.mode === 'packs'
    ? clampInt(plan.packsPerPlayer, 1, 99) * clampInt(plan.componentsPerPack, 1, 999)
    : clampInt(plan.componentsPerPlayer, 1, 9_999);
  const required = clampInt(plan.players, 2, 64) * perPlayer + clampInt(plan.reserve, 0, 99_999);
  const difference = available - required;
  const status = available === 0
    ? 'empty'
    : difference < 0
      ? 'short'
      : difference < Math.max(plan.players, Math.ceil(required * 0.08))
        ? 'tight'
        : 'ready';
  return { available, required, difference, status, perPlayer };
}

export function participantNames(plan: Pick<Plan, 'players' | 'playerNames'>): string[] {
  return Array.from({ length: clampInt(plan.players, 2, 64) }, (_, index) => {
    const name = plan.playerNames[index]?.trim();
    return name || `Player ${index + 1}`;
  });
}

export function generatePairingRounds(names: string[], requestedRounds: number): Pairing[][] {
  const entrants = [...names];
  if (entrants.length % 2) entrants.push('BYE');
  const roundCount = clampInt(requestedRounds, 1, 20);
  const rotating = [...entrants];
  const result: Pairing[][] = [];

  for (let round = 0; round < roundCount; round += 1) {
    const pairings: Pairing[] = [];
    for (let table = 0; table < rotating.length / 2; table += 1) {
      let playerA = rotating[table];
      let playerB = rotating[rotating.length - 1 - table];
      if (round % 2 && table === 0) [playerA, playerB] = [playerB, playerA];
      pairings.push({ table: table + 1, playerA, playerB, bye: playerA === 'BYE' || playerB === 'BYE' });
    }
    result.push(pairings);
    rotating.splice(1, 0, rotating.pop()!);
  }
  return result;
}

export function buildRounds(plan: Plan): RoundPlan[] {
  const names = participantNames(plan);
  const pairings = generatePairingRounds(names, plan.rounds);
  const start = new Date(`${plan.eventDate || todayLocal()}T${plan.startTime || '19:00'}:00`);
  if (Number.isNaN(start.valueOf())) return [];
  let cursor = start.getTime() + (plan.setupMinutes + plan.buildMinutes) * 60_000;

  return pairings.map((roundPairings, index) => {
    const roundStart = new Date(cursor);
    cursor += plan.roundMinutes * 60_000;
    const roundEnd = new Date(cursor);
    cursor += plan.breakMinutes * 60_000;
    return {
      round: index + 1,
      startsAt: formatTime(roundStart),
      endsAt: formatTime(roundEnd),
      pairings: roundPairings,
    };
  });
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date);
}

export function validatePlan(value: unknown): Plan {
  if (!value || typeof value !== 'object') throw new Error('That file does not contain a plan.');
  const input = value as Partial<Plan>;
  if (input.version !== 1 || typeof input.eventName !== 'string' || !Array.isArray(input.inventory)) {
    throw new Error('This file is not valid planner JSON. Choose a JSON backup exported by Limited Night Planner.');
  }
  if (input.inventory.some((item) => !item || typeof item !== 'object' || Array.isArray(item))) {
    throw new Error('This file is not valid planner JSON. Choose a JSON backup exported by Limited Night Planner.');
  }
  const base = createDefaultPlan();
  return {
    ...base,
    ...input,
    players: clampInt(input.players, 2, 64),
    inventory: input.inventory.slice(0, 100).map((item) => ({
      id: typeof item.id === 'string' ? item.id : uid(),
      name: typeof item.name === 'string' ? item.name.slice(0, 80) : 'Components',
      count: clampInt(item.count, 0, 1_000_000),
      included: item.included !== false,
      note: typeof item.note === 'string' ? item.note.slice(0, 300) : '',
    })),
    playerNames: Array.isArray(input.playerNames) ? input.playerNames.map(String).slice(0, 64) : [],
    timer: { ...base.timer, ...(input.timer ?? {}), running: false, endsAt: null },
    updatedAt: new Date().toISOString(),
  };
}

export function planToCsv(plan: Plan): string {
  const quote = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const rows: unknown[][] = [
    ['Limited Night Planner export'],
    ['Event', plan.eventName],
    ['Date', plan.eventDate],
    ['Start', plan.startTime],
    ['Players', plan.players],
    [],
    ['Inventory', 'Count', 'Included', 'Note'],
    ...plan.inventory.map((item) => [item.name, item.count, item.included ? 'Yes' : 'No', item.note]),
    [],
    ['Round', 'Start', 'End', 'Table', 'Player A', 'Player B'],
    ...buildRounds(plan).flatMap((round) => round.pairings.map((pair) => [round.round, round.startsAt, round.endsAt, pair.table, pair.playerA, pair.playerB])),
  ];
  return rows.map((row) => row.map(quote).join(',')).join('\r\n');
}

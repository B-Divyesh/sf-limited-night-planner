import { describe, expect, it } from 'vitest';
import {
  buildRounds,
  calculateFeasibility,
  createDefaultPlan,
  generatePairingRounds,
  planToCsv,
  validatePlan,
} from '../src/domain';

describe('inventory feasibility', () => {
  it('counts only compatible checked groups and the reserve', () => {
    const plan = createDefaultPlan();
    plan.players = 4;
    plan.packsPerPlayer = 3;
    plan.componentsPerPack = 15;
    plan.reserve = 12;
    plan.inventory = [
      { id: 'a', name: 'Main box', count: 200, included: true, note: '' },
      { id: 'b', name: 'Different backs', count: 100, included: false, note: '' },
    ];
    expect(calculateFeasibility(plan)).toMatchObject({ available: 200, required: 192, difference: 8, status: 'tight' });
  });

  it('reports a shortage clearly', () => {
    const plan = createDefaultPlan();
    plan.inventory = [{ id: 'a', name: 'Bulk', count: 100, included: true, note: '' }];
    expect(calculateFeasibility(plan)).toMatchObject({ status: 'short', difference: -92 });
  });
});

describe('round routing', () => {
  it('never pairs a participant with the same opponent twice', () => {
    const rounds = generatePairingRounds(['A', 'B', 'C', 'D'], 3);
    const pairs = rounds.flat().map(({ playerA, playerB }) => [playerA, playerB].sort().join('-'));
    expect(new Set(pairs).size).toBe(pairs.length);
  });

  it('adds one bye per round for an odd group', () => {
    const rounds = generatePairingRounds(['A', 'B', 'C', 'D', 'E'], 3);
    expect(rounds.every((round) => round.filter((pair) => pair.bye).length === 1)).toBe(true);
  });

  it('keeps the requested round count when a second circuit is needed', () => {
    expect(generatePairingRounds(['A', 'B', 'C', 'D'], 5)).toHaveLength(5);
  });

  it('builds deterministic start and end times', () => {
    const plan = createDefaultPlan();
    plan.eventDate = '2026-08-27';
    plan.startTime = '19:00';
    plan.setupMinutes = 15;
    plan.buildMinutes = 30;
    plan.roundMinutes = 45;
    plan.breakMinutes = 5;
    const rounds = buildRounds(plan);
    expect(rounds[0].startsAt).toMatch(/7:45\s?PM/i);
    expect(rounds[1].startsAt).toMatch(/8:35\s?PM/i);
  });
});

describe('portable plans', () => {
  it('rejects unsupported imports', () => {
    expect(() => validatePlan({ version: 99, inventory: [] })).toThrow(/not supported/i);
  });

  it('escapes CSV fields', () => {
    const plan = createDefaultPlan();
    plan.eventName = 'Draft, "late"';
    expect(planToCsv(plan)).toContain('"Draft, ""late"""');
  });
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEstimate, formatPKR, getWorkshopOperationalStatus } from './pricing.ts';

test('calculateEstimate handles standard sedan base services', () => {
  const result = calculateEstimate({
    category: 'sedan',
    services: [
      { id: 'diag', name: 'Computer Diagnostics', basePricePkr: 5000, durationMinutes: 60 },
      { id: 'oil', name: 'Oil & Filter Service', basePricePkr: 8500, durationMinutes: 45 },
    ],
  });

  assert.equal(result.baseServicesTotalPkr, 13500);
  assert.equal(result.categoryMultiplier, 1.0);
  assert.equal(result.categoryAdjustedTotalPkr, 13500);
  assert.equal(result.subtotalPkr, 13500);
  assert.equal(result.taxPkr, 675); // 5% of 13500
  assert.equal(result.grandTotalPkr, 14175);
  assert.equal(result.totalDurationMinutes, 105);
});

test('calculateEstimate scales with exotic multiplier and priority surcharge', () => {
  const result = calculateEstimate({
    category: 'exotic', // 2.1x multiplier
    services: [
      { id: 'tuning', name: 'Engine Dyno Tuning', basePricePkr: 20000, durationMinutes: 120 },
    ],
    addons: [
      { id: 'obd', name: 'OBD Telemetry Scan', pricePkr: 3000 },
    ],
    isPriority: true, // +20% on adjusted services
  });

  // Base: 20,000 * 2.1 = 42,000
  assert.equal(result.categoryAdjustedTotalPkr, 42000);
  // Priority: 20% of 42,000 = 8,400
  assert.equal(result.prioritySurchargePkr, 8400);
  // Addons: 3,000
  assert.equal(result.addonsTotalPkr, 3000);
  // Subtotal = 42000 + 8400 + 3000 = 53,400
  assert.equal(result.subtotalPkr, 53400);
  // Tax (5%) = 2,670
  assert.equal(result.taxPkr, 2670);
  // Grand total = 56,070
  assert.equal(result.grandTotalPkr, 56070);
});

test('formatPKR formats numbers cleanly', () => {
  assert.equal(formatPKR(15000), 'PKR 15,000');
  assert.equal(formatPKR(250000), 'PKR 250,000');
});

test('getWorkshopOperationalStatus returns valid timezone and status', () => {
  // Test Monday at 12:00 PM UTC (which is 5:00 PM PKT -> OPEN)
  const mondayNoonUtc = new Date('2026-10-19T12:00:00Z');
  const status = getWorkshopOperationalStatus(mondayNoonUtc);
  assert.equal(status.timezone, 'PKT (UTC+5)');
  assert.equal(status.isOpen, true);
  assert.match(status.statusText, /OPEN/);
});

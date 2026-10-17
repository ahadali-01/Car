import test from 'node:test';
import assert from 'node:assert/strict';
import { isSlotAvailable, calculateRemainingBays, validateBookingRequest } from './booking.ts';

test('isSlotAvailable returns true when below capacity', () => {
  const slot = { time: '10:00 AM', capacity: 2, bookedCount: 1 };
  assert.equal(isSlotAvailable(slot), true);
  assert.equal(calculateRemainingBays(slot), 1);
});

test('isSlotAvailable returns false when at or above capacity', () => {
  const slot = { time: '10:00 AM', capacity: 2, bookedCount: 2 };
  assert.equal(isSlotAvailable(slot), false);
  assert.equal(calculateRemainingBays(slot), 0);
});

test('validateBookingRequest catches missing or malformed inputs', () => {
  const badEmail = validateBookingRequest({
    customerName: 'Test Driver',
    customerEmail: 'not-an-email',
    customerPhone: '+923001234567',
    appointmentDate: '2026-10-25',
    slotTime: '10:00 AM',
    serviceIds: ['srv_diag'],
  });
  assert.equal(badEmail.valid, false);
  assert.match(badEmail.error!, /email/i);

  const missingServices = validateBookingRequest({
    customerName: 'Test Driver',
    customerEmail: 'driver@test.com',
    customerPhone: '+923001234567',
    appointmentDate: '2026-10-25',
    slotTime: '10:00 AM',
    serviceIds: [],
  });
  assert.equal(missingServices.valid, false);
  assert.match(missingServices.error!, /service/i);

  const validReq = validateBookingRequest({
    customerName: 'Ahad Nisar',
    customerEmail: 'ahad@example.com',
    customerPhone: '+923001234567',
    appointmentDate: '2026-10-25',
    slotTime: '10:00 AM',
    serviceIds: ['srv_dyno'],
    vehicleYear: 2024,
  });
  assert.equal(validReq.valid, true);
});

/**
 * Pure logic for slot availability and appointment concurrency checking.
 */

export interface SlotCapacity {
  time: string;
  capacity: number;
  bookedCount: number;
}

export function isSlotAvailable(slot: SlotCapacity): boolean {
  return slot.bookedCount < slot.capacity;
}

export function calculateRemainingBays(slot: SlotCapacity): number {
  return Math.max(0, slot.capacity - slot.bookedCount);
}

export function validateBookingRequest(input: {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  appointmentDate?: string;
  slotTime?: string;
  serviceIds?: string[];
  vehicleYear?: number;
}): { valid: boolean; error?: string } {
  if (!input.customerName || input.customerName.trim().length === 0) {
    return { valid: false, error: 'Customer name is required' };
  }
  if (!input.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.customerEmail)) {
    return { valid: false, error: 'Valid customer email is required' };
  }
  if (!input.customerPhone || input.customerPhone.trim().length < 8) {
    return { valid: false, error: 'Valid contact phone number is required' };
  }
  if (!input.appointmentDate || !/^\d{4}-\d{2}-\d{2}$/.test(input.appointmentDate)) {
    return { valid: false, error: 'Valid appointment date (YYYY-MM-DD) is required' };
  }
  if (!input.slotTime || input.slotTime.trim().length === 0) {
    return { valid: false, error: 'Slot time is required' };
  }
  if (!input.serviceIds || input.serviceIds.length === 0) {
    return { valid: false, error: 'At least one service must be specified' };
  }
  if (input.vehicleYear && (input.vehicleYear < 1970 || input.vehicleYear > 2030)) {
    return { valid: false, error: 'Vehicle year must be between 1970 and 2030' };
  }
  return { valid: true };
}

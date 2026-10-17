/**
 * Pure business logic for workshop pricing and estimates.
 * Currency: PKR (Pakistani Rupee).
 */

export interface VehicleCategoryMultiplier {
  category: 'sedan' | 'suv' | 'sports' | 'exotic' | 'truck';
  multiplier: number;
}

export const CATEGORY_MULTIPLIERS: Record<string, number> = {
  sedan: 1.0,
  suv: 1.25,
  sports: 1.45,
  exotic: 2.1,
  truck: 1.35,
};

export interface ServiceItem {
  id: string;
  name: string;
  basePricePkr: number; // in PKR
  durationMinutes: number;
}

export interface PricingAddon {
  id: string;
  name: string;
  pricePkr: number;
}

export interface EstimateRequest {
  category: 'sedan' | 'suv' | 'sports' | 'exotic' | 'truck';
  services: ServiceItem[];
  addons?: PricingAddon[];
  isPriority?: boolean; // Express / VIP lane surcharge
}

export interface EstimateResult {
  baseServicesTotalPkr: number;
  categoryMultiplier: number;
  categoryAdjustedTotalPkr: number;
  addonsTotalPkr: number;
  prioritySurchargePkr: number;
  subtotalPkr: number;
  taxPkr: number; // 5% provincial service tax where applicable
  grandTotalPkr: number;
  totalDurationMinutes: number;
  formattedGrandTotal: string;
}

/**
 * Calculates itemized workshop cost estimate.
 * All intermediate amounts use integer PKR rounding to avoid float drift.
 */
export function calculateEstimate(req: EstimateRequest): EstimateResult {
  const multiplier = CATEGORY_MULTIPLIERS[req.category] ?? 1.0;

  const baseServicesTotalPkr = req.services.reduce((sum, s) => sum + Math.max(0, s.basePricePkr), 0);
  const totalDurationMinutes = req.services.reduce((sum, s) => sum + Math.max(0, s.durationMinutes), 0);

  // Category adjustments apply only to labor/diagnostic base services
  const categoryAdjustedTotalPkr = Math.round(baseServicesTotalPkr * multiplier);

  const addonsTotalPkr = (req.addons ?? []).reduce((sum, a) => sum + Math.max(0, a.pricePkr), 0);

  // Priority express lane surcharge: +20% on adjusted services if selected
  const prioritySurchargePkr = req.isPriority ? Math.round(categoryAdjustedTotalPkr * 0.2) : 0;

  const subtotalPkr = categoryAdjustedTotalPkr + addonsTotalPkr + prioritySurchargePkr;
  const taxPkr = Math.round(subtotalPkr * 0.05);
  const grandTotalPkr = subtotalPkr + taxPkr;

  return {
    baseServicesTotalPkr,
    categoryMultiplier: multiplier,
    categoryAdjustedTotalPkr,
    addonsTotalPkr,
    prioritySurchargePkr,
    subtotalPkr,
    taxPkr,
    grandTotalPkr,
    totalDurationMinutes,
    formattedGrandTotal: `PKR ${grandTotalPkr.toLocaleString('en-PK')}`,
  };
}

/**
 * Formats PKR currency cleanly
 */
export function formatPKR(amount: number): string {
  return `PKR ${Math.round(amount).toLocaleString('en-PK')}`;
}

/**
 * Validates whether the workshop is currently open based on operating hours.
 * Workshop operates:
 * Monday - Saturday: 09:00 - 20:00 (PKT / UTC+5)
 * Sunday: 10:00 - 17:00 (Emergency Diagnostics Only)
 */
export function getWorkshopOperationalStatus(currentDate: Date = new Date()): {
  isOpen: boolean;
  statusText: string;
  nextChange: string;
  timezone: string;
} {
  // Convert to UTC+5 (Pakistan Standard Time)
  const utc = currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
  const pktDate = new Date(utc + 5 * 3600000);

  const day = pktDate.getDay(); // 0 is Sun, 1 is Mon...
  const hours = pktDate.getHours();
  const minutes = pktDate.getMinutes();
  const currentTimeVal = hours * 60 + minutes;

  const timezone = 'PKT (UTC+5)';

  if (day === 0) {
    // Sunday: 10:00 to 17:00 (600 to 1020 mins)
    const openTime = 10 * 60;
    const closeTime = 17 * 60;
    if (currentTimeVal >= openTime && currentTimeVal < closeTime) {
      return { isOpen: true, statusText: 'OPEN (SUNDAY SPECIAL ROSTER)', nextChange: 'Closes at 5:00 PM PKT', timezone };
    }
    return { isOpen: false, statusText: 'CLOSED', nextChange: 'Opens Monday at 9:00 AM PKT', timezone };
  } else {
    // Mon - Sat: 09:00 to 20:00 (540 to 1200 mins)
    const openTime = 9 * 60;
    const closeTime = 20 * 60;
    if (currentTimeVal >= openTime && currentTimeVal < closeTime) {
      return { isOpen: true, statusText: 'OPEN NOW', nextChange: 'Closes at 8:00 PM PKT', timezone };
    }
    return { isOpen: false, statusText: 'CLOSED FOR TODAY', nextChange: 'Opens at 9:00 AM PKT', timezone };
  }
}

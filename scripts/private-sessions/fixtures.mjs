/**
 * Test fixtures and non-production seed data for CASC One-to-One Sessions checks.
 * NEVER use production credentials or IDs here.
 */

export const FIXTURE_COURSE_SLUG = 'casc-academy';

export const FIXTURE_USERS = {
  admin: {
    id: '00000000-0000-4000-a000-000000000001',
    email: 'test-admin@medlex.local',
    fullName: 'Test Admin Host',
    role: 'admin',
    emailVerified: true,
  },
  host: {
    id: '00000000-0000-4000-a000-000000000002',
    userId: '00000000-0000-4000-a000-000000000001',
    displayName: 'Dr. CASC Host',
    email: 'casc-host@medlex.local',
    calendarId: 'casc-host-calendar@group.calendar.google.com',
    isActive: true,
  },
  learner1: {
    id: '00000000-0000-4000-b000-000000000001',
    email: 'test-learner1@medlex.local',
    fullName: 'Test Learner One',
    role: 'learner',
    emailVerified: true,
  },
  learner2: {
    id: '00000000-0000-4000-b000-000000000002',
    email: 'test-learner2@medlex.local',
    fullName: 'Test Learner Two',
    role: 'learner',
    emailVerified: true,
  },
  unverifiedLearner: {
    id: '00000000-0000-4000-b000-000000000099',
    email: 'unverified-learner@medlex.local',
    fullName: 'Unverified Learner',
    role: 'learner',
    emailVerified: false,
  },
};

export const FIXTURE_OFFERS = {
  direct: {
    offerType: 'direct',
    quantity: 1,
    defaultPriceMinorUnits: 250000, // 2500.00 EGP
    currency: 'EGP',
  },
  package_5: {
    offerType: 'package_5',
    quantity: 5,
    defaultPriceMinorUnits: 1125000, // 11250.00 EGP (10% discount)
    currency: 'EGP',
  },
  package_10: {
    offerType: 'package_10',
    quantity: 10,
    defaultPriceMinorUnits: 2000000, // 20000.00 EGP (20% discount)
    currency: 'EGP',
  },
};

/**
 * Returns UTC Date strings for Cairo time slots.
 * Default is 48 hours in future, 10:00 Cairo time.
 * Cairo is UTC+2 standard / UTC+3 DST. Native Intl ensures correct offset.
 */
export function createCairoSlotTiming(daysAhead = 2, startHourCairo = 10) {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysAhead);

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  const timeStr = `${String(startHourCairo).padStart(2, '0')}:00`;

  // Determine Cairo offset for this target date
  // Using ISO representation in Africa/Cairo
  const sampleUtc = new Date(Date.UTC(year, targetDate.getMonth(), targetDate.getDate(), startHourCairo, 0, 0));
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Cairo',
    timeZoneName: 'shortOffset',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // Format to find offset
  const parts = formatter.formatToParts(sampleUtc);
  const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value || 'GMT+2';
  // GMT+2 or GMT+3
  const offsetHours = parseInt(tzPart.replace(/[^0-9+-]/g, ''), 10) || 2;

  // Cairo hour to UTC hour:
  const utcStartHour = startHourCairo - offsetHours;
  const startsAtUtc = new Date(Date.UTC(year, targetDate.getMonth(), targetDate.getDate(), utcStartHour, 0, 0));
  const endsAtUtc = new Date(startsAtUtc.getTime() + 60 * 60 * 1000);

  return {
    date: dateStr,
    startTime: timeStr,
    startsAt: startsAtUtc.toISOString(),
    endsAt: endsAtUtc.toISOString(),
    cairoTimezone: 'Africa/Cairo',
  };
}

/**
 * Generates deterministic or unique test idempotency keys (16 to 128 chars)
 */
export function generateTestIdempotencyKey(prefix = 'test-idemp') {
  const suffix = Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
  return `${prefix}-${suffix}`;
}

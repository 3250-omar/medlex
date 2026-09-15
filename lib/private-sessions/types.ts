import type {
  PrivateSessionOfferCode,
  PrivateSessionOfferKind,
  PrivateSessionSlotStatus,
  SessionPaymentPurpose,
  SessionPaymentStatus,
  SessionEntitlementStatus,
  SessionBookingFundingType,
  SessionBookingStatus,
  PrivateSessionMeetingStatus,
  PrivateSessionEmailStatus,
} from "@/types/database";

export type {
  PrivateSessionOfferCode,
  PrivateSessionOfferKind,
  PrivateSessionSlotStatus,
  SessionPaymentPurpose,
  SessionPaymentStatus,
  SessionEntitlementStatus,
  SessionBookingFundingType,
  SessionBookingStatus,
  PrivateSessionMeetingStatus,
  PrivateSessionEmailStatus,
};

export interface LocalizedOfferDTO {
  id: string;
  code: PrivateSessionOfferCode;
  kind: PrivateSessionOfferKind;
  sessionCount: 1 | 5 | 10;
  priceMinor: number;
  currency: string;
  title: string;
}

export interface SlotDTO {
  id: string;
  startsAt: string;
  endsAt: string;
  cairoTimezone: "Africa/Cairo";
  hostDisplayName?: string;
}

export interface EntitlementSummaryDTO {
  id: string;
  purchased: number;
  reserved: number;
  consumed: number;
  remaining: number;
  status: SessionEntitlementStatus;
}

export interface BookingDTO {
  id: string;
  startsAt: string;
  endsAt: string;
  status: SessionBookingStatus;
  meetingStatus: PrivateSessionMeetingStatus;
  emailStatus: PrivateSessionEmailStatus;
  joinUrl: string | null;
  sessionLink?: string | null;
}

export interface SessionContextData {
  offers: LocalizedOfferDTO[];
  authenticated: boolean;
  emailVerified: boolean;
  entitlements: EntitlementSummaryDTO[];
  upcomingBookings: BookingDTO[];
}

export type FulfillmentStatus =
  | "not_applicable"
  | "pending"
  | "ready"
  | "failed";

export interface PurchaseStatusData {
  purchaseId: string;
  status: SessionPaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  entitlement: EntitlementSummaryDTO | null;
  booking: BookingDTO | null;
}

export interface CheckoutResultData {
  purchaseId: string;
  status: "pending";
  checkoutUrl: string;
  holdExpiresAt: string | null;
}

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
    correlationId?: string;
  };
}

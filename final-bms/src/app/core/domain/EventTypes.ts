// Base event interface. All domain events implement this.
export interface DomainEvent {
  readonly type: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly timestamp: Date;
  readonly version: number;
  readonly occurredAt: Date;
  readonly data: Record<string, unknown>;
}

// CRM Events
export interface LeadCreatedEvent extends DomainEvent {
  type: 'LeadCreated';
  data: {
    source: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
}

export interface LeadQualifiedEvent extends DomainEvent {
  type: 'LeadQualified';
  data: {
    qualificationScore: number;
    intent: string;
  };
}

export interface OpportunityCreatedEvent extends DomainEvent {
  type: 'OpportunityCreated';
  data: {
    leadId: string;
    accountId?: string;
    expectedValue: number;
    expectedCloseDate: Date;
    stage: string;
  };
}

// Sales Events
export interface OrderConfirmedEvent extends DomainEvent {
  type: 'OrderConfirmed';
  data: {
    opportunityId?: string;
    accountId: string;
    lines: Array<{ productId: string; quantity: number; amount: number }>;
    totalAmount: number;
  };
}

export interface InventoryReservedEvent extends DomainEvent {
  type: 'InventoryReserved';
  data: {
    productId: string;
    location: string;
    quantity: number;
    reservationId: string;
  };
}

export interface InvoiceIssuedEvent extends DomainEvent {
  type: 'InvoiceIssued';
  data: {
    orderId: string;
    accountId: string;
    amount: number;
    dueDate: Date;
  };
}

// Finance Events
export interface JournalEntryPostedEvent extends DomainEvent {
  type: 'JournalEntryPosted';
  data: {
    period: string;
    lines: Array<{ accountCode: string; debit?: number; credit?: number }>;
    narration: string;
  };
}

// Union type of all domain events
export type AllDomainEvents =
  | LeadCreatedEvent
  | LeadQualifiedEvent
  | OpportunityCreatedEvent
  | OrderConfirmedEvent
  | InventoryReservedEvent
  | InvoiceIssuedEvent
  | JournalEntryPostedEvent;

// Base command interface
export interface Command {
  readonly id: string;
  readonly timestamp: Date;
  readonly userId: string;
  readonly organizationId: string;
  readonly version: number;
}

// CRM Commands
export interface CreateLeadCommand extends Command {
  readonly type: 'CreateLead';
  source: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export interface QualifyLeadCommand extends Command {
  readonly type: 'QualifyLead';
  leadId: string;
  qualificationScore: number;
  intent: string;
}

export interface CreateOpportunityCommand extends Command {
  readonly type: 'CreateOpportunity';
  leadId: string;
  accountId?: string;
  expectedValue: number;
  expectedCloseDate: Date;
  stage: string;
}

// Sales Commands - Hard constraint: Order cannot be created directly from Lead
export interface CreateOrderDraftCommand extends Command {
  readonly type: 'CreateOrderDraft';
  opportunityId: string; // MUST come from Opportunity, never directly from Lead
  accountId: string;
  lines: Array<{ productId: string; quantity: number; unitPrice: number }>;
}

// Hard constraint: ConfirmOrder must atomically reserve inventory
export interface ConfirmOrderCommand extends Command {
  readonly type: 'ConfirmOrder';
  orderId: string;
  // Inventory reservations are implicit - system validates atomically
}

export interface ReserveInventoryCommand extends Command {
  readonly type: 'ReserveInventory';
  productId: string;
  location: string;
  quantity: number;
  orderId: string; // Tied to order for atomic confirmation
}

export interface IssueInvoiceCommand extends Command {
  readonly type: 'IssueInvoice';
  orderId: string;
  accountId: string;
  amount: number;
  dueDate: Date;
}

// Finance Commands - Only internal finance can issue these
export interface PostJournalEntryCommand extends Command {
  readonly type: 'PostJournalEntry';
  period: string;
  lines: Array<{ accountCode: string; debit?: number; credit?: number }>;
  narration: string;
  invoiceId?: string; // Reference for audit trail
}

// Union type of all commands
export type AllCommands =
  | CreateLeadCommand
  | QualifyLeadCommand
  | CreateOpportunityCommand
  | CreateOrderDraftCommand
  | ConfirmOrderCommand
  | ReserveInventoryCommand
  | IssueInvoiceCommand
  | PostJournalEntryCommand;

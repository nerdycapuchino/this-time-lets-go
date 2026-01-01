# StudioBMS: Production-Ready Enterprise System Architecture

## Status: ACTIVE IMPLEMENTATION

This document is the source of truth for the architectural direction of StudioBMS, the unified business management system. All implementation must follow these constraints exactly.

---

## IMMUTABLE CONSTRAINTS

### 1. Sales Flow - Lead → Opportunity → Order (HARD RULE)

**Rule**: Leads can NEVER directly spawn Orders. Only Opportunities can.

- `Lead.createFromCommand()` → emits `LeadCreatedEvent`
- `Lead.qualify()` → emits `LeadQualifiedEvent`
- `Lead` can be disqualified (becomes immutable history)
- `Opportunity.createFromCommand(leadId)` → ONLY path to orders
- `Order.createFromCommand(opportunityId)` → ONLY accepts Opportunity reference
- Any attempt to create Order from Lead should reject with `InvariantError`

**Why**: Enforces sales discipline. Without this, ghost revenue and unsanctioned deals bypass pipeline review.

---

### 2. Inventory Reservation - Atomic with Order Confirmation (HARD RULE)

**Rule**: `ConfirmOrder` must atomically reserve ALL required inventory in a single transaction. No partial confirms.

- `ConfirmOrderCommand` triggers saga:
  1. Load Order aggregate
  2. For each line: call `InventoryItem.reserve(productId, location, quantity, orderId)`
  3. If ANY reservation fails → entire command fails, Order stays draft
  4. If ALL succeed → emit `OrderConfirmedEvent` + `InventoryReservedEvent` per line

**Why**: Prevents overselling. System guarantees: confirmed orders = reserved inventory.

---

### 3. UI Discipline - No Module Styling (HARD RULE)

**Rule**: ALL visual tokens, shadows, spacing, neumorphic behavior live in `ui/theme` or `ui/components/shared`.

- No `module.css` in `ui/modules/*`
- No inline styles except data-driven values (width, height from config)
- All colors, borders, shadows come from centralized token system
- Monochromatic palette: shades of gray + single accent color

**Why**: Prevents UI rot. Teams can't drift styles. Enterprise consistency survives growth.

---

## Core Domain Aggregates (FINAL)

```
Organization
  └─ owns: legal identity, currencies, fiscal config

UserAccount + Role + PermissionSet
  └─ owns: auth, RBAC matrix (never sprinkled)

StaffMember
  └─ owns: employment profile (separate from UserAccount)

Contact + Account + Lead + Opportunity
  └─ owns: CRM relationships

Product + InventoryItem + PriceList
  └─ owns: catalog, stock, pricing

Order + Invoice + Payment
  └─ owns: sales fulfillment, billing

Project + Task + TimesheetEntry + PayrollRun
  └─ owns: delivery, time, compensation

JournalEntry
  └─ owns: immutable GL postings (NEVER edited in-place)

WpContentItem + IntegrationEndpoint
  └─ owns: external integrations (input/output mirrors)
```

---

## Event-Driven Backbone

Every command to an aggregate results in ZERO or MORE domain events. Events are:

- **Immutable**: once emitted, never changed
- **Versioned**: aggregateId + version prevents duplicates
- **First-class**: only aggregates emit domain events, never UI/integrations
- **Forbidden direct emission**:
  - `*Created`, `*Updated`, `*Deleted`
  - `InvoiceIssued`, `PaymentCaptured`, `JournalEntryPosted`
  - All RBAC and finance events

Integrations (WordPress, payment gateways) issue COMMANDS only:
- `HandleWpFormSubmission(data)` → `LeadCreated` event
- `InitiatePayment(orderId)` → `PaymentInitiated` event

---

## Project Structure

```
src/app/
  core/
    domain/                # Business logic boundary
      errors/
        DomainError.ts      # All domain exceptions
      crm/
        Lead.ts             # Lead aggregate
        Opportunity.ts      # Opportunity aggregate (NEW: create next)
        Account.ts          # Account aggregate (NEW)
        Contact.ts          # Contact aggregate (NEW)
      sales/
        Order.ts            # Order aggregate (NEW: implements hard rule)
        InventoryItem.ts    # Inventory aggregate (NEW: atomic reservation)
        Invoice.ts          # Invoice aggregate (NEW)
        Payment.ts          # Payment aggregate (NEW)
      projects/
        Project.ts          # Project aggregate (NEW)
        Task.ts             # Task aggregate (NEW)
        TimesheetEntry.ts   # Timesheet aggregate (NEW)
      finance/
        JournalEntry.ts     # GL posting aggregate (NEW)
        PayrollRun.ts       # Payroll aggregate (NEW)
      EventTypes.ts         # All domain event interfaces (COMMITTED)
      CommandTypes.ts       # All command interfaces (COMMITTED)
    bus/
      EventBus.ts           # In-process event dispatcher (NEW)
      CommandBus.ts         # Command validator & handler routing (NEW)
    rbac/
      AuthorizationPolicies.ts  # Role → permission matrix (NEW)
  infrastructure/
    persistence/
      orm/                  # Database mapping (NEW)
      eventstore/           # Event sourcing (NEW)
      projections/          # Read models per module (NEW)
    http/
      server.ts             # Express/Fastify setup (NEW)
      controllers/          # HTTP→Command endpoints (NEW)
      middleware/           # Auth, RBAC, error handling (NEW)
    integrations/
      wordpress/            # WP webhook handlers (NEW)
      payments/             # Payment gateway adapters (NEW)
  ui/
    theme/
      monochromeNeumorphic.css  # Master design system (NEW)
      tokens.ts                 # Color, spacing, shadows (NEW)
    components/
      shared/                  # Neumorphic UI primitives (NEW)
        Button.tsx
        TextField.tsx
        Panel.tsx
        Card.tsx
    modules/
      dashboard/           # No styling here (use shared components)
      crm/
      sales/
      projects/
      finance/
```

---

## Immediate Next Implementation Steps

### Phase 1: Core Aggregates (THIS WEEK)
1. ✅ DomainError.ts - COMMITTED
2. ✅ EventTypes.ts - COMMITTED
3. ✅ CommandTypes.ts - COMMITTED
4. ✅ Lead.ts - COMMITTED
5. **Opportunity.ts** - IN PROGRESS
   - Must reference Lead (leadId)
   - Only Opportunity can spawn Order
   - Status machine: created → stage transitions → won/lost
6. **Order.ts** - CRITICAL
   - Accept ONLY opportunityId (enforce hard rule)
   - Contain ConfirmOrder saga orchestrator
7. **InventoryItem.ts** - CRITICAL
   - reserve() method tied to Order.confirm()
   - Atomic transaction semantics
8. Account.ts, Contact.ts, Product.ts, Invoice.ts, Payment.ts
9. Project.ts, Task.ts, TimesheetEntry.ts, PayrollRun.ts
10. JournalEntry.ts (finance-only)

### Phase 2: Event & Command Bus (NEXT WEEK)
1. EventBus.ts - in-process dispatcher
2. CommandBus.ts - command validation & routing
3. EventStore.ts - append-only event log
4. Projections for each module (read models)

### Phase 3: HTTP Layer (WEEK 3)
1. Server setup
2. CRM controllers (POST /crm/leads, POST /crm/opportunities)
3. Sales controllers (POST /sales/orders, POST /sales/invoices)
4. Auth middleware, RBAC middleware
5. Error handler middleware

### Phase 4: UI Foundation (WEEK 4)
1. Monochromatic neumorphic theme system
2. Shared UI components
3. Dashboard layout shell
4. Module page skeletons

---

## Critical Implementation Notes

### Order Creation Hard Constraint Enforcement

In `Order.ts`:

```typescript
static createFromCommand(cmd: CreateOrderDraftCommand): Order {
  // MANDATORY: opportunityId must be present
  if (!cmd.opportunityId) {
    throw new ValidationError(
      'Order MUST reference an Opportunity. Direct creation from Lead is forbidden.'
    );
  }
  // Rest of order creation...
}
```

In HTTP controller:

```typescript
POST /sales/orders
{
  opportunityId: "opp_123",  // REQUIRED
  accountId: "acc_456",
  lines: [...]
}
// Attempting to omit opportunityId → 400 ValidationError
```

### Atomic Inventory Saga

```typescript
async function ConfirmOrderHandler(cmd: ConfirmOrderCommand) {
  const order = await repo.getOrder(cmd.orderId);
  const reservations = [];
  
  try {
    for (const line of order.lines) {
      const inventory = await repo.getInventory(line.productId);
      inventory.reserve(line.quantity, order.id);
      reservations.push({ inventory, quantity: line.quantity });
    }
    // All succeeded
    order.confirm();
    order.emitEvent(OrderConfirmedEvent);
    await repo.save(order, reservations);
  } catch (err) {
    // ANY failure → rollback, order stays DRAFT
    throw new InvariantError('Inventory reservation failed', 'Order', 'reservation_failed');
  }
}
```

---

## What NOT to Do

- ❌ Edit JournalEntry after posting (create correcting entries instead)
- ❌ Allow Order creation without Opportunity
- ❌ Permit partial Order confirmation (all-or-nothing)
- ❌ Sprinkle RBAC checks across routes (centralize in middleware)
- ❌ Create module-specific CSS files
- ❌ Emit domain events from UI or integrations
- ❌ Store sensitive data (API keys, passwords) in domain events
- ❌ Bypass inventory checks for "urgent" orders

---

## Success Metrics

1. System deploys without refactoring
2. All modules read from single canonical data model
3. Website → CRM → Ops → Finance updates in <100ms
4. Leadership views system health in 60 seconds (dashboard)
5. UI described as "enterprise," never "fun"
6. No module operates independently; all state changes propagate

---

## Local Development Setup

```bash
cd final-bms
npm install

# Watch and build domain layer
npm run build:domain

# Start dev server
npm run dev

# Run tests (once wired)
npm test
```

---

**Last Updated**: January 2025  
**Status**: ACTIVE REBUILD - No compromises on correctness

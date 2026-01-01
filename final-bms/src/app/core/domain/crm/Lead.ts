import { LeadCreatedEvent, LeadQualifiedEvent } from '../EventTypes';
import { CreateLeadCommand, QualifyLeadCommand } from '../CommandTypes';
import { ValidationError, InvariantError } from '../errors/DomainError';

export enum LeadStatus {
  CREATED = 'created',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  DISQUALIFIED = 'disqualified',
}

export class Lead {
  readonly id: string;
  readonly organizationId: string;
  readonly source: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email?: string;
  readonly phone?: string;
  readonly status: LeadStatus;
  readonly qualificationScore?: number;
  readonly intent?: string;
  readonly createdAt: Date;
  readonly version: number;
  private uncommittedEvents: LeadCreatedEvent[] | LeadQualifiedEvent[] = [];

  private constructor(
    id: string,
    organizationId: string,
    source: string,
    firstName: string,
    lastName: string,
    status: LeadStatus,
    createdAt: Date,
    version: number,
    email?: string,
    phone?: string,
    qualificationScore?: number,
    intent?: string
  ) {
    this.id = id;
    this.organizationId = organizationId;
    this.source = source;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.status = status;
    this.qualificationScore = qualificationScore;
    this.intent = intent;
    this.createdAt = createdAt;
    this.version = version;
  }

  static createFromCommand(cmd: CreateLeadCommand): Lead {
    // Validation
    if (!cmd.firstName || cmd.firstName.trim().length === 0) {
      throw new ValidationError('Lead first name is required');
    }
    if (!cmd.lastName || cmd.lastName.trim().length === 0) {
      throw new ValidationError('Lead last name is required');
    }
    if (!cmd.source || cmd.source.trim().length === 0) {
      throw new ValidationError('Lead source is required');
    }

    const lead = new Lead(
      cmd.id,
      cmd.organizationId,
      cmd.source,
      cmd.firstName,
      cmd.lastName,
      LeadStatus.CREATED,
      cmd.timestamp,
      1,
      cmd.email,
      cmd.phone
    );

    lead.emitEvent({
      type: 'LeadCreated',
      aggregateId: lead.id,
      aggregateType: 'Lead',
      timestamp: cmd.timestamp,
      version: 1,
      occurredAt: cmd.timestamp,
      data: {
        source: cmd.source,
        firstName: cmd.firstName,
        lastName: cmd.lastName,
        email: cmd.email,
        phone: cmd.phone,
      },
    } as LeadCreatedEvent);

    return lead;
  }

  qualify(cmd: QualifyLeadCommand): void {
    // Lead must not already be converted or disqualified
    if (this.status === LeadStatus.CONVERTED) {
      throw new InvariantError(
        'Cannot qualify a converted lead',
        'Lead',
        'lead_already_converted'
      );
    }
    if (this.status === LeadStatus.DISQUALIFIED) {
      throw new InvariantError(
        'Cannot qualify a disqualified lead',
        'Lead',
        'lead_already_disqualified'
      );
    }

    const event: LeadQualifiedEvent = {
      type: 'LeadQualified',
      aggregateId: this.id,
      aggregateType: 'Lead',
      timestamp: cmd.timestamp,
      version: this.version + 1,
      occurredAt: cmd.timestamp,
      data: {
        qualificationScore: cmd.qualificationScore,
        intent: cmd.intent,
      },
    };

    this.emitEvent(event);
    // Update internal state
    (this as any).status = LeadStatus.QUALIFIED;
    (this as any).qualificationScore = cmd.qualificationScore;
    (this as any).intent = cmd.intent;
    (this as any).version += 1;
  }

  markAsConverted(): void {
    if (this.status === LeadStatus.CONVERTED) {
      throw new InvariantError(
        'Lead is already converted',
        'Lead',
        'lead_already_converted'
      );
    }
    (this as any).status = LeadStatus.CONVERTED;
  }

  private emitEvent(
    event: LeadCreatedEvent | LeadQualifiedEvent
  ): void {
    this.uncommittedEvents.push(event);
  }

  getUncommittedEvents(): (LeadCreatedEvent | LeadQualifiedEvent)[] {
    return this.uncommittedEvents;
  }

  clearUncommittedEvents(): void {
    this.uncommittedEvents = [];
  }
}

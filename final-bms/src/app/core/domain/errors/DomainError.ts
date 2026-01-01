// Base domain error. All domain violations extend this.
export class DomainError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    statusCode: number = 400,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Command validation failure
export class ValidationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

// Permission/authorization failure
export class PermissionError extends DomainError {
  constructor(message: string, requiredPermission?: string) {
    super(
      message,
      'PERMISSION_DENIED',
      403,
      requiredPermission ? { requiredPermission } : undefined
    );
  }
}

// Business invariant violation
export class InvariantError extends DomainError {
  constructor(message: string, aggregate: string, invariant: string) {
    super(message, 'INVARIANT_VIOLATION', 409, { aggregate, invariant });
  }
}

// Aggregate not found
export class AggregateNotFoundError extends DomainError {
  constructor(aggregateType: string, id: string) {
    super(
      `${aggregateType} with id ${id} not found`,
      'AGGREGATE_NOT_FOUND',
      404,
      { aggregateType, id }
    );
  }
}

// Concurrent modification
export class ConcurrencyError extends DomainError {
  constructor(aggregateType: string, id: string, expectedVersion: number) {
    super(
      `Concurrent modification detected for ${aggregateType} ${id}`,
      'CONCURRENCY_ERROR',
      409,
      { aggregateType, id, expectedVersion }
    );
  }
}

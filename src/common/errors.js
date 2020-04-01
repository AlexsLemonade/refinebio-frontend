/** Extending native classes can be tricky with babel
 * https://stackoverflow.com/a/46971044/763705
 */
export class ExtendableError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, ExtendableError.prototype);
    this.name = this.constructor.name;
  }
}

export class ApiVersionMismatchError extends ExtendableError {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, ApiVersionMismatchError.prototype);
  }
}

export class ServerError extends ExtendableError {
  constructor(status, data) {
    super(`${status} ${JSON.stringify(data)}`);
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class InvalidTokenError extends ExtendableError {
  constructor() {
    super();
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}

export class EmailSubscriptionError extends ExtendableError {
  constructor(email) {
    super('EmailSubscriptionError');
    this.data = email;
    Object.setPrototypeOf(this, EmailSubscriptionError.prototype);
  }
}

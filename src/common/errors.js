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

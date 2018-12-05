/** Extending native classes can be tricky with babel
 * https://stackoverflow.com/a/46971044/763705
 */
export class ExtendableError {
  constructor(message) {
    this.name = this.constructor.name;
    this.message = message;
    this.stack = new Error(message).stack;
  }
}
ExtendableError.prototype = Object.create(Error.prototype);
ExtendableError.prototype.constructor = ExtendableError;

export class ApiVersionMismatchError extends ExtendableError {}

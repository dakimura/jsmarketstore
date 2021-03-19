// common error class
class BaseError extends Error {
  constructor(e?: string) {
    super(e)
    this.name = new.target.name
    // The below line is necessary only if the target is older than ES2015 (ES3, ES5)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

// store the specified unknown column type name in columnType
export class UnknownColumnTypeError extends BaseError {
  constructor(public columnType: string, e?: string) {
    super(e)
  }
}

// constructor is not necessary if there is no additional error parameter
// class ExampleError extends BaseError {}

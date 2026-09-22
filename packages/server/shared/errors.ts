export class ServerError extends Error {
  public readonly statusCode: number

  constructor(statusCode: number, message: string, stack?: string) {
    super(message)

    this.statusCode = statusCode

    if (stack) {
      this.stack = stack
    }
  }
}

import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export class Exception extends HTTPException {
  private _code: string;

  /**
   * @param status - HTTP status code for the exception
   * @param code - Application-specific error code
   * @param message - Optional custom error message
   */
  constructor(status: ContentfulStatusCode, code: string, message?: string) {
    super(status, { message });
    this._code = code;
  }

  get code() {
    return this._code;
  }
}

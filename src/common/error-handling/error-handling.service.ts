import { Injectable, HttpStatus } from "@nestjs/common";

@Injectable()
export class ErrorHandlingService {
  handleException(error: { status: number; response: string }) {
    const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.response || "Internal server error";

    console.error(error);

    return { status, message };
  }
}

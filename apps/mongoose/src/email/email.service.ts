import { Injectable } from "@nestjs/common";
import { EmailType } from "./interfaces";

@Injectable()
export class EmailService {
  public sendEmail(_template: EmailType, _data: Record<string, any>): Promise<boolean> {
    return Promise.resolve(true);
  }
}

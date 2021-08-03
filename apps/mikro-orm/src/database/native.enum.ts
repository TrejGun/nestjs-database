import { Type } from "@mikro-orm/core";

export class NativeEnumArrayType extends Type<Array<string>, string> {
  convertToDatabaseValue(value: Array<string> | string | undefined): string {
    if (!value) {
      return `{}`;
    } else if (Array.isArray(value)) {
      return `{${value.join(",")}}`;
    } else {
      return value;
    }
  }

  convertToJSValue(value: Array<string> | string | undefined): Array<string> {
    if (!value) {
      return [];
    } else if (Array.isArray(value)) {
      return value;
    } else {
      return value.substring(1, value.length - 1).split(",");
    }
  }

  toJSON(value: Array<string> | string | undefined): string {
    return JSON.stringify(value);
  }

  getColumnType(): string {
    // TODO fix me
    return "user_role_enum[]";
  }
}

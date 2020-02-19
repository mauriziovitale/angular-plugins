import { JsonObject } from '@angular-devkit/core';

export interface LiteServeBuilderSchema extends JsonObject {
  browserTarget: string;
  port: integer;
  open: boolean;
  watch: boolean;
  logLevel: string;
}

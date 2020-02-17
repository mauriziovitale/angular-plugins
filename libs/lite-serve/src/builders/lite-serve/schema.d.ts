import { JsonObject } from '@angular-devkit/core';

export interface LiteServeBuilderSchema extends JsonObject {
  port: integer;
  outdir: string;
  open: boolean;
  logLevel: string;
}

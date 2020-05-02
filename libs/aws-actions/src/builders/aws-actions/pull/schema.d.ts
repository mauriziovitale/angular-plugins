import { JsonObject } from '@angular-devkit/core';

export interface AwsActionsPullSchema extends JsonObject {
  bucket: string;
  artifactName: string;
  outputPath: string;
}

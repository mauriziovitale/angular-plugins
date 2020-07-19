import { JsonObject } from '@angular-devkit/core';

export interface BuildBuilderSchema extends JsonObject {
    name: string;
    type: string;
    outputPath: string;
}

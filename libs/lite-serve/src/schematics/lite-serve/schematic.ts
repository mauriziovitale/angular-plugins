import {
  Rule,
  Tree,
  SchematicContext
} from '@angular-devkit/schematics';
import { LiteServeSchematicSchema } from './schema';
import { runSetupLiteServe } from './actions';

export default function(options: LiteServeSchematicSchema): Rule {
  return (host: Tree, context: SchematicContext) => {
    return runSetupLiteServe(host, context, options);
  };
}

import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { BuildBuilderSchema } from './schema';
import { createProcess } from './process';
import {
  directoryExists
} from '@nrwl/nx-plugin/testing';

export function runBuilder(
  options: BuildBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  return Observable.create(async observer => {
    try {    
      const { name, type, outputPath } = options;
      const execType = options.type === 'json' ? '--json --no-progress | jq ' : '';
      context.logger.info(`outputPath ${outputPath}`);

      const dirExist = directoryExists(outputPath);
      if (!dirExist) {
        context.logger.error(`Directory ${outputPath} does not exist`);
      } else {
        context.logger.info(`Directory exist ${dirExist}`);

        const command = `yarn licenses list ${execType} > ${outputPath}/${name}.${type}`;
        context.logger.info(command);
  
        await createProcess(command, undefined, true, undefined);
        context.logger.info('Licenses generated');
      }
      observer.next({ success: true });
      observer.complete();
      
    } catch (e) {
      observer.error(`ERROR: Something went wrong in @angular-custom-builders/licenses - ${e.message}`);
    }
  });
}

export default createBuilder(runBuilder);

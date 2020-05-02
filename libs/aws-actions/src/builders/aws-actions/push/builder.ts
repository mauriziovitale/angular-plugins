import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { AwsActionsPullSchema } from './schema';
import { createProcess } from './process';
import { loadEnvVars } from './env-util';

export function runBuilder(
  options: AwsActionsPullSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  loadEnvVars();
  return Observable.create(async observer => {
    try {
      const bucket = options.bucket;
      const artifactName = options.artifactName;
      const outputPath = options.outputPath;
      const destination = `${bucket}/${artifactName}`

      await createProcess(`tar cvfj ./s3-artifact.tmp ${outputPath} -C ${outputPath}`, undefined, true, undefined);
      await createProcess(`aws s3 cp  ./s3-artifact.tmp ${destination} `, undefined, true, undefined);
      await createProcess(`rm ./s3-artifact.tmp`, undefined, true, undefined);

      observer.next({ success: true });
      observer.complete();
    } catch (e) {
      observer.error(`ERROR: Something went wrong in @angular-custom-builders/aws-actions:push - ${e.message}`);
    }
  });
}

export default createBuilder(runBuilder);

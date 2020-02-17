import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LiteServeBuilderSchema } from './schema';

const browserSync = require('browser-sync');
browserSync.create();
export function runBuilder(
  options: LiteServeBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  return of({ success: true }).pipe(
    tap(() => {
      browserSync.init({
        port: options.port,
        server:  options.outdir,
        watch: false,
        open: options.open,
        logLevel: options.logLevel
      });
      context.logger.info(`lite-serve serving folder ${options.outdir} on port ${options.port}`);
    })
  );
}

export default createBuilder(runBuilder);

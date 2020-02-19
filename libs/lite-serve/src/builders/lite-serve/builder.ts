import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
  targetFromTargetString
} from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LiteServeBuilderSchema } from './schema';

import * as browserSync from 'browser-sync'
browserSync.create();
export function runBuilder(
  options: LiteServeBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  return of({ success: true }).pipe(
    tap(async() => {
      let outputPath = 'dist';
      if (options.browserTarget) {
        const browserTarget = targetFromTargetString(options.browserTarget);
        const rawBrowserOptions = await context.getTargetOptions(browserTarget);
        outputPath = rawBrowserOptions.outputPath as string;
      }
      browserSync.init({
        port: options.port,
        server: outputPath,
        watch: false,
        open: options.open,
        logLevel: options.logLevel
      });
      context.logger.info(`lite-serve serving folder ${outputPath} on port ${options.port}`);
    })
  );
}

export default createBuilder(runBuilder);

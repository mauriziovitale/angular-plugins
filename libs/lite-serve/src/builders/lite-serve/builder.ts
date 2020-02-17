import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LiteServeBuilderSchema } from './schema';

export function runBuilder(
  options: LiteServeBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  return of({ success: true }).pipe(
    tap(() => {
      context.logger.info('Builder ran for lite-serve');
    })
  );
}

export default createBuilder(runBuilder);

import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { E2eInvolvedBuilderSchema } from './schema';
import { findClassWithInvolvedImport, findClassName } from './ast-utils';

export function runBuilder(
  options: E2eInvolvedBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  return of({ success: true }).pipe(
    tap(() => {
      const filesChanged = ['text.component.ts', 'app.component.ts', 'app.component.html'];

      const componentSet = new Set([]);
      componentSet.add(filesChanged[0]);

      const selectorFileSet = new Set([]);
      selectorFileSet.add('apps/involved-app/src/app/text.selector.ts');

      const selectorClassNameList = findClassName(selectorFileSet);
      selectorClassNameList.forEach( (name) => context.logger.info(`selector: ${name}`));

      const meta = findClassWithInvolvedImport('./apps/involved-app/src/app', 'e2e', selectorClassNameList);
      meta.forEach( (e2e) => context.logger.info(`e2e involved: ${e2e}`));

      context.logger.info(`Builder ran for e2e-involved`);
    })
  );
}

export default createBuilder(runBuilder);

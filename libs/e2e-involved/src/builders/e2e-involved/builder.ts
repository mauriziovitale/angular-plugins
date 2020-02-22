import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { E2eInvolvedBuilderSchema } from './schema';
import { findClassWithInvolvedImport, findClassName, convertComponentToSelectorFile, findInterfaceName } from './ast-utils';

export function runBuilder(
  options: E2eInvolvedBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  return of({ success: true }).pipe(
    tap(() => {
      const filesChanged = [
        'apps/involved-app/src/app/app.component.ts',
        'apps/involved-app/src/app/hero.model.ts',
        'apps/involved-app/src/app/app.component.html'];

      const componentList = new Set([]);
      let componentMergeList: Set<string>;
      const modelList = new Set([]);
      Array.from(filesChanged.values()).forEach( (file) => {
        if (file.endsWith('.component.ts')) {
          componentList.add(file);
        } else if (file.endsWith('.component.html')) {
          const transformHTMLtoTs = file.replace('.html','.ts');
          componentList.add(transformHTMLtoTs);
        } else if (file.endsWith('.model.ts')) {
          modelList.add(file);
        }
      });

      const modelClassNameList = findInterfaceName(modelList);
      const metaComponentImportModel = findClassWithInvolvedImport('./apps/involved-app/src/app', 'component', modelClassNameList);

      componentMergeList = new Set([...componentList, ...metaComponentImportModel])

      const selectorFileSet = convertComponentToSelectorFile(componentMergeList);

      const selectorClassNameList = findClassName(selectorFileSet);

      selectorClassNameList.forEach( (name) => context.logger.info(`selector: ${name}`));

      const metaE2EImportSelector = findClassWithInvolvedImport('./apps/involved-app/src/app', 'e2e', selectorClassNameList);
      metaE2EImportSelector.forEach( (e2e) => context.logger.info(`e2e involved: ${e2e}`));

      context.logger.info(`Builder ran for e2e-involved`);
    })
  );
}

export default createBuilder(runBuilder);

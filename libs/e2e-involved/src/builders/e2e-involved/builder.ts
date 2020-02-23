import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
  targetFromTargetString
} from '@angular-devkit/architect';
import { E2eInvolvedBuilderSchema } from './schema';
import { findClassWithInvolvedImport, convertComponentToSelectorFile, findInterfaceName, replaceRelativePath } from './ast-utils';

export async function runBuilder(
  options: E2eInvolvedBuilderSchema,
  context: BuilderContext
): Promise<BuilderOutput> {
  const browserTarget = targetFromTargetString(options.browserTarget);
  const projectMetadata = await context.getProjectMetadata(browserTarget.project);
  const projectAppMetadata = await context.getProjectMetadata(options.projectTarget);

  const e2eInvolved = detectInvolvedTest(context, projectMetadata, projectAppMetadata);
  const override = {
    specs: [...Array.from(e2eInvolved.values())]
  }
  const browserTargetRun = await context.scheduleTarget(browserTarget, override);

  const [browserResult] = await Promise.all([
    browserTargetRun.result
  ]);
  return browserResult;
}

function detectInvolvedTest(context, projectE2EMetadata, projectAppMetadata) {
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
  const metaComponentImportModel = findClassWithInvolvedImport(projectAppMetadata.sourceRoot, 'component', modelClassNameList);

  componentMergeList = new Set([...componentList, ...metaComponentImportModel])

  const selectorClassNameList = convertComponentToSelectorFile(componentMergeList);

  selectorClassNameList.forEach( (name) => context.logger.info(`selector: ${name}`));

  const metaE2EImportSelector = findClassWithInvolvedImport(projectE2EMetadata.sourceRoot, 'e2e-spec', selectorClassNameList);
  metaE2EImportSelector.forEach( (e2e) => context.logger.info(`e2e involved: ${e2e}`));
  const metaE2EImportSelectorRelativePath = replaceRelativePath(projectE2EMetadata.root, metaE2EImportSelector);
  return metaE2EImportSelectorRelativePath;
}

export default createBuilder(runBuilder);

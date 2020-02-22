import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { E2eInvolvedSchematicSchema } from './schema';

describe('e2e-involved schematic', () => {
  let appTree: Tree;
  const options: E2eInvolvedSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@angular-plugins/e2e-involved',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('e2eInvolved', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});

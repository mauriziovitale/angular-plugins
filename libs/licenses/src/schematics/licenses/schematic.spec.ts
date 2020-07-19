import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { LicensesSchematicSchema } from './schema';

describe('licenses schematic', () => {
  let appTree: Tree;
  const options: LicensesSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@angular-custom-builders/licenses',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('licenses', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});

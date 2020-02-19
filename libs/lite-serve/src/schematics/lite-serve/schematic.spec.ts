import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { LiteServeSchematicSchema } from './schema';

describe('lite-serve schematic', () => {
  let appTree: Tree;
  const options: LiteServeSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@angular-custom-builders/lite-serve',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('liteServe', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});

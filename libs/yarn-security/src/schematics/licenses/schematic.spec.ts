import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { YarnSecuritySchematicSchema } from './schema';

describe('yarn security licenses schematic', () => {
  let appTree: Tree;
  const options: YarnSecuritySchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@angular-custom-builders/licenses',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner
        .runSchematicAsync('licenses', options, appTree)
        .toPromise()
    ).resolves.not.toThrowError();
  });
});

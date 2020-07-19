import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { YarnSecuritySchematicSchema } from './schema';

describe('yarn-security schematic', () => {
  let appTree: Tree;
  const options: YarnSecuritySchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@angular-custom-builders/yarn-security',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner
        .runSchematicAsync('yarn-security', options, appTree)
        .toPromise()
    ).resolves.not.toThrowError();
  });
});

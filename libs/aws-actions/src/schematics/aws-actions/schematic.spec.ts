import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { AwsActionsSchematicSchema } from './schema';

describe('aws-actions schematic', () => {
  let appTree: Tree;
  const options: AwsActionsSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@angular-plugins/aws-actions',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('awsActions', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});

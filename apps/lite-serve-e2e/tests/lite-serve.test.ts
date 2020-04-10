import {
  ensureNxProject,
  newNxProject,
  runNxCommandAsync,
  uniq
} from '@nrwl/nx-plugin/testing';

import {
  addProjectToNxJsonInTree
} from '@nrwl/workspace';

describe('lite-serve e2e', () => {
  it('should create lite-serve', async done => {
    const plugin = uniq('lite-serve');
    ensureNxProject('@angular-custom-builders/lite-serve:setup', 'dist/libs/lite-serve');

    await runNxCommandAsync(
      `generate @angular-custom-builders/lite-serve:setup ${plugin}`
    );
    // const result = await runNxCommandAsync(`run ${plugin}:lite-server --port=432`);
    // expect(result.stdout).toContain(`lite-serve serving folder dist on port 432`);

    done();
  });

});

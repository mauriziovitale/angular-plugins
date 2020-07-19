import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq
} from '@nrwl/nx-plugin/testing';
describe('aws-actions e2e', () => {
  it('should create aws-actions', async done => {
    const plugin = uniq('aws-actions');
    ensureNxProject('@angular-custom-builders/aws-actions', 'dist/libs/aws-actions');
    await runNxCommandAsync(
      `generate @angular-custom-builders/aws-actions:pull ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Builder ran');

    done();
  });

});

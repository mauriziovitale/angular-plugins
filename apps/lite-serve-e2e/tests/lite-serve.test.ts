import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq
} from '@nrwl/nx-plugin/testing';
describe('lite-serve e2e', () => {
  it('should create lite-serve', async done => {
    const plugin = uniq('lite-serve');
    ensureNxProject('@angular-custom-builders/lite-serve', 'dist/libs/lite-serve');
    await runNxCommandAsync(
      `generate @angular-custom-builders/lite-serve:liteServe ${plugin}`
    );

    const result = await runNxCommandAsync(`run ${plugin}:lite-server --port=432`);
    expect(result.stdout).toContain(`lite-serve serving folder dist on port 432`);

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async done => {
      const plugin = uniq('lite-serve');
      ensureNxProject('@angular-custom-builders/lite-serve', 'dist/libs/lite-serve');
      await runNxCommandAsync(
        `generate @angular-custom-builders/lite-serve:liteServe ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async done => {
      const plugin = uniq('lite-serve');
      ensureNxProject('@angular-custom-builders/lite-serve', 'dist/libs/lite-serve');
      await runNxCommandAsync(
        `generate @angular-custom-builders/lite-serve:liteServe ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});

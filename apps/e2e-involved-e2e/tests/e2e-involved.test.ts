import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq
} from '@nrwl/nx-plugin/testing';
describe('e2e-involved e2e', () => {
  it('should create e2e-involved', async done => {
    const plugin = uniq('e2e-involved');
    debugger;
    ensureNxProject('@angular-plugins/e2e-involved', 'dist/libs/e2e-involved');
    await runNxCommandAsync(
      `generate @angular-plugins/e2e-involved:e2eInvolved ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Builder ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async done => {
      const plugin = uniq('e2e-involved');
      ensureNxProject(
        '@angular-plugins/e2e-involved',
        'dist/libs/e2e-involved'
      );
      await runNxCommandAsync(
        `generate @angular-plugins/e2e-involved:e2eInvolved ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async done => {
      const plugin = uniq('e2e-involved');
      ensureNxProject(
        '@angular-plugins/e2e-involved',
        'dist/libs/e2e-involved'
      );
      await runNxCommandAsync(
        `generate @angular-plugins/e2e-involved:e2eInvolved ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});

import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('yarn-security e2e', () => {
  it('should create yarn-security', async (done) => {
    const plugin = uniq('yarn-security');
    ensureNxProject(
      '@angular-custom-builders/yarn-security',
      'dist/libs/yarn-security'
    );
    await runNxCommandAsync(
      `generate @angular-custom-builders/yarn-security:yarnSecurity ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Builder ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('yarn-security');
      ensureNxProject(
        '@angular-custom-builders/yarn-security',
        'dist/libs/yarn-security'
      );
      await runNxCommandAsync(
        `generate @angular-custom-builders/yarn-security:yarnSecurity ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('yarn-security');
      ensureNxProject(
        '@angular-custom-builders/yarn-security',
        'dist/libs/yarn-security'
      );
      await runNxCommandAsync(
        `generate @angular-custom-builders/yarn-security:yarnSecurity ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});

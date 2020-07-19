import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  updateFile,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import * as fs from "fs"

describe('licenses e2e', () => {
  it('should create licenses', async (done) => {
    const plugin = uniq('licenses');
    ensureNxProject('@angular-custom-builders/licenses', 'dist/libs/licenses');
    await runNxCommandAsync(
      `generate @angular-custom-builders/licenses:licenses ${plugin}`
    );

    const result = await runNxCommandAsync(`licenses ${plugin}`);
    expect(result.stdout).toContain('Licenses generated');

    done();
  });

  it('should generate custom folder  licenses', async (done) => {
    const plugin = uniq('licenses');
    ensureNxProject('@angular-custom-builders/licenses', 'dist/libs/licenses');
    await runNxCommandAsync(
      `generate @angular-custom-builders/licenses:licenses ${plugin}`
    );

    const dir = 'my-folder';
    const dirAbsolute = `./tmp/nx-e2e/proj/${dir}`;
    fs.mkdir(dirAbsolute, (err) => {
      if (err) throw err;
    });

    await runNxCommandAsync(`licenses ${plugin} --outputPath="${dir}"`);
    expect(() =>
      checkFilesExist(`${dir}/license.txt`)
    ).not.toThrow();
    done();
  });

  it('should throw an error if the destination folder does not exist', async (done) => {
    const plugin = uniq('licenses');

    ensureNxProject('@angular-custom-builders/licenses', 'dist/libs/licenses');
    await runNxCommandAsync(
      `generate @angular-custom-builders/licenses:licenses ${plugin}`
    );

    const dir = 'fake' 
    const result = await runNxCommandAsync(`licenses ${plugin} --outputPath="${dir}"`);
    expect(result.stderr).toContain(`Directory ${dir} does not exist`);
    done();
  });

  it('should generate report with name licenses.txt by default ', async (done) => {
    const plugin = uniq('licenses');
    ensureNxProject('@angular-custom-builders/licenses', 'dist/libs/licenses');
    await runNxCommandAsync(
      `generate @angular-custom-builders/licenses:licenses ${plugin}`
    );

    await runNxCommandAsync(`licenses ${plugin}`);
    expect(() =>
        checkFilesExist(`license.txt`)
      ).not.toThrow();
      done();
  });

  it('should generate report in json format if option type json is provided', async (done) => {
    const plugin = uniq('licenses');
    ensureNxProject('@angular-custom-builders/licenses', 'dist/libs/licenses');
    await runNxCommandAsync(
      `generate @angular-custom-builders/licenses:licenses ${plugin}`
    );

    await runNxCommandAsync(`licenses ${plugin} --type=json`);
    expect(() =>
        checkFilesExist(`license.json`)
      ).not.toThrow();
      done();
  });

  it('should generate report with custom name if option name is provided', async (done) => {
    const plugin = uniq('licenses');
    const fileName = 'my-custom-report';
    ensureNxProject('@angular-custom-builders/licenses', 'dist/libs/licenses');
    await runNxCommandAsync(
      `generate @angular-custom-builders/licenses:licenses ${plugin}`
    );

    await runNxCommandAsync(`licenses ${plugin} --name=${fileName}`);
    expect(() =>
        checkFilesExist(`${fileName}.txt`)
      ).not.toThrow();
      done();
  });

  it('should generate report with custom name of type json if options are provided', async (done) => {
    const plugin = uniq('licenses');
    const fileName = 'my-custom-report';
    const type = 'json';
    ensureNxProject('@angular-custom-builders/licenses', 'dist/libs/licenses');
    await runNxCommandAsync(
      `generate @angular-custom-builders/licenses:licenses ${plugin}`
    );

    await runNxCommandAsync(`licenses ${plugin} --name=${fileName} --type=${type}`);
    expect(() =>
        checkFilesExist(`${fileName}.${type}`)
      ).not.toThrow();
      done();
  });

  xit('should generate report for a new dependency', async (done) => {
    const plugin = uniq('licenses');
    const type = 'json';
    ensureNxProject('@angular-custom-builders/licenses', 'dist/libs/licenses');
    await runNxCommandAsync(
      `generate @angular-custom-builders/licenses:licenses ${plugin}`
    );

    const packageJson = readJson('package.json');
    packageJson.dependencies['@alfresco/adf-core'] = `3.7.0`;
    await updateFile('package.json', JSON.stringify(packageJson, null, 2));

    await runNxCommandAsync(`licenses ${plugin} --type=${type}`);
    
    const licenseJson = readJson('license.json');
    const dependency = licenseJson.data.body[0];
    
    expect(dependency).toEqual([
      '@alfresco/adf-core',
      '3.7.0',
      'Apache-2.0',
      'https://github.com/Alfresco/alfresco-ng2-components.git',
      'Unknown',
      'Alfresco Software, Ltd.'
    ]);

    expect(() =>
        checkFilesExist(`license.${type}`)
      ).not.toThrow();
      done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('licenses');
      ensureNxProject(
        '@angular-custom-builders/licenses',
        'dist/libs/licenses'
      );
      await runNxCommandAsync(
        `generate @angular-custom-builders/licenses:licenses ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('licenses');
      ensureNxProject(
        '@angular-custom-builders/licenses',
        'dist/libs/licenses'
      );
      await runNxCommandAsync(
        `generate @angular-custom-builders/licenses:licenses ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});

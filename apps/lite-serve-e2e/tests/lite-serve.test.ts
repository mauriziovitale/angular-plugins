import {
  ensureNxProject,
  runNxCommandAsync,
  uniq
} from '@nrwl/nx-plugin/testing';
import { readFileSync, writeFileSync } from 'fs';

describe('lite-serve e2e', () => {
  it('should setup an existing project', async done => {
    const plugin = uniq('lite-serve');
    ensureNxProject('@angular-custom-builders/lite-serve:setup', 'dist/libs/lite-serve');
    const pluginE2EName = `${plugin}-e2e`;
    const projects = { [plugin] : createAppDefinition(plugin), [pluginE2EName]: createAppE2EDefinition(pluginE2EName)};

    patchWorkspaceJsonForPlugin(projects);

    await runNxCommandAsync(
      `g @angular-custom-builders/lite-serve:setup --name ${plugin}`
    );
    const result = await runNxCommandAsync(`run ${plugin}:lite-serve --port=432`);
    expect(result.stdout).toContain(`lite-serve serving folder dist/apps/${plugin} on port 432`);

    done();
  });

  it('should raise an exception in case the e2e project does not follow the default naming convention', async done => {
    const plugin = uniq('lite-serve');
    ensureNxProject('@angular-custom-builders/lite-serve:setup', 'dist/libs/lite-serve');

    const pluginE2EName = `${plugin}-custom-e2e`;
    const projects = { [plugin] : createAppDefinition(plugin), [pluginE2EName]: createAppE2EDefinition(pluginE2EName)};

    patchWorkspaceJsonForPlugin(projects);

    const result = await runNxCommandAsync(
      `g @angular-custom-builders/lite-serve:setup --name ${plugin}`
    );
    expect(result.stderr).toContain(`The project ${plugin}-e2e does not exist`);

    done();
  });

  it('should be able to setup a project with a custom e2e name', async done => {
    const plugin = uniq('lite-serve');
    ensureNxProject('@angular-custom-builders/lite-serve:setup', 'dist/libs/lite-serve');

    const pluginE2EName = `${plugin}-custom-e2e`;
    const projects = { [plugin] : createAppDefinition(plugin), [pluginE2EName]: createAppE2EDefinition(pluginE2EName)};

    patchWorkspaceJsonForPlugin(projects);

    await runNxCommandAsync(
      `g @angular-custom-builders/lite-serve:setup --name ${plugin} -e ${pluginE2EName}`
    );
    const result = await runNxCommandAsync(`run ${plugin}:lite-serve --port=432`);
    expect(result.stdout).toContain(`lite-serve serving folder dist/apps/${plugin} on port 432`);

    done();
  });

  function patchWorkspaceJsonForPlugin(projects) {
    const p = JSON.parse(readFileSync(tmpProjPath('workspace.json')).toString());
    p.projects = projects;
    writeFileSync(tmpProjPath('workspace.json'), JSON.stringify(p, null, 2));
  }

  function createAppDefinition(plugin: string) {
    return {
      root: plugin,
      sourceRoot: `${plugin}/src`,
      projectType: 'application',
      architect: {
        build: {
          builder: '@angular-devkit/build-angular:browser',
          options: {
            outputPath: `dist/apps/${plugin}`
          }
        }
      }
    }
  }

  function createAppE2EDefinition(plugin: string) {
    return {
      root: plugin,
      sourceRoot: `${plugin}-e2e/src`,
      projectType: 'application',
      architect: {
        e2e: {
          options: {
            devServerTarget: `${plugin}:serve`
          }
        }
      }
    }
  }

  function tmpProjPath(path?: string) {
    return path
      ? `${process.cwd()}/tmp/nx-e2e/proj/${path}`
      : `${process.cwd()}/tmp/nx-e2e/proj`;
  }

});

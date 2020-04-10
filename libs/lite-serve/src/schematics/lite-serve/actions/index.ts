import { chain, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  updateWorkspace
} from '@nrwl/workspace';
import { LiteServeSchematicSchema } from '../schema';
export function runSetupLiteServe(
  host: Tree,
  context: SchematicContext,
  options: LiteServeSchematicSchema
) {
  const rulesToApply = updateWorkspace(workspace => {
    const projects = workspace.projects;
    if (projects.has(options.name)) {
      projects.get(options.name).targets.add({
        name: 'lite-serve',
        builder: '@angular-custom-builders/lite-serve:dist-serve',
        options: {
          browserTarget: `${options.name}:build`
        }
      });
    } else {
      context.logger.error(`The project ${options.name} does not exist`);
    }

    const e2eApp = options.e2e ? options.e2e : `${options.name}-e2e`;
    if (projects.has(e2eApp) && projects.get(e2eApp).targets.has('e2e')) {
      context.logger.info(`Found project ${e2eApp} with target e2e`);

      const targetE2E = projects.get(e2eApp).targets.get('e2e');
      const devServerTargetLite = `${options.name}:lite-serve`;

      targetE2E.options.devServerTarget = `${devServerTargetLite}`;
      context.logger.warn(`Replacing devServerTarget previous: ${targetE2E.options.devServerTarget} new: ${devServerTargetLite}`);

      if (targetE2E.configurations) {
          Object.keys(targetE2E.configurations).forEach((config) => {
            context.logger.info(`Found additional configuration ${config}`);

            const foundConfig = targetE2E.configurations[config];
            if (foundConfig.devServerTarget) {
              const devConfigServerTargetLite = `${options.name}:lite-serve:${config}`;
              foundConfig.devServerTarget = `${devConfigServerTargetLite}`;
              context.logger.warn(`Replacing devServerTarget previous: ${foundConfig.devServerTarget} new: ${devConfigServerTargetLite}`);
            }
            else {
                context.logger.error(`the configuration ${config} does not have the property devServerTarget`);
            }
          });
      }
      else {
          context.logger.info(`There are no additional configurations`);
      }
    }
    else {
        context.logger.error(`The project ${e2eApp} does not exist`);
    }
  });

  return chain([rulesToApply]);
}

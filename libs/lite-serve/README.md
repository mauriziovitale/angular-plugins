# lite-serve

This builder allows you to run a lite-server with an existing dist folder.
Useful in case of a CI/CD to avoid to build the project as part of the ng e2e command.

The only mandatory option is *browserTarget*. Using the target the *lite-serve* builder is able to figure out the path of the dist folder.

## Options
*browserTarget*: Target to serve

*port*: Port to listen on. Default 4200

*logLevel*: Can be either "info", "debug", "warn", or "silent". Default: info

*watch*: Rebuild on change. Default false

*open*: Opens the url in default browser. Default false

## How to use it

### Basic Configuration
```json
"example-app": {
      "projectType": "application",
      "root": "apps/example-app",
      "sourceRoot": "apps/example-app/src",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/apps/example-app"
          }
        },
        "lite-serve": {
          "builder": "@angular-custom-builders/lite-serve:dist-serve",
          "options": {
            "browserTarget": "example-app:build"
          }
        }
      }
```

1. Build the example app to generate the dist folder `dist/apps/example-app`
```cmd
nx build example-app
```

2. Run the e2e without rebuilding the app
```cmd
nx run example-app:lite-serve
```

### Override the default Configuration
```json
"example-app": {
      "projectType": "application",
      "root": "apps/example-app",
      "sourceRoot": "apps/example-app/src",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/apps/example-app"
          }
        },
        "lite-serve": {
          "builder": "@angular-custom-builders/lite-serve:dist-serve",
          "options": {
            "browserTarget": "example-app:build"
          },
          "configuration": {
            "verbose": {
              "port": 9999,
              "open": true,
              "logLevel": "debug"
            }
          }
        }
      }
```

1. Build the example app to generate the dist folder `dist/apps/example-app`
```cmd
nx build example-app
```

2. Run the e2e with a custom configuration
```cmd
nx run example-app:lite-serve:verbose
```

## Quick-start using Nx <a name="quickstart"></a>

1. Create a new project with the nx cli.

   ```sh
   npx create-nx-workspace@latest workspace --preset="angular" --appName="myapp" --style="css"
   cd myapp
   ```

1. Add `lite-serve` to your project

  ```sh
  npx ng add @angular-custom-builders/lite-serve myapp
  ```

  Note: In case the e2e project does not follow the default rule myapp-e2e you can use the -e option to pass the custom name 

  ```sh
  npx ng add @angular-custom-builders/lite-serve myapp -e custom-name-e2e
  ```

1. Run the e2e with an existing dist folder

  ```sh
  ng run myapp-e2e:e2e
  ```

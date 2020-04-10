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

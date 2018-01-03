# Angular Commons

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.5.

## Local Packaging

- Run `npm run build:lib` to create a library for this component.
- This will create a sharable `tgz` file.
- For local development, this tgz can be installed into other projects with `npm install '<local-path-to-commons>/msc-dms-commons-angular-<version>.tgz'`

## Development process

All shared modules should be placed be under /src/lib/core/

If another project wants to import from core, `import { ... } from 'msc-dms-commons-angular/core/<module_name>`  
If another module within commons wants to import from core, `import { ... } from @msc-dms-commons-angular/core/<module_name>`

When developing a module that uses a shared module, there will be errors when importing. This happens because the shared module is not found in node_modules yet. It can be ignored or you can run `npm run build:core` to fix it.

## Jenkins Builds

Jenkins will automatically package Commons into a `tgz` file and publish it to the Nexus repo. 

Installing commons through npm in another project will pull the `tgz` that was built by Jenkins.


---

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

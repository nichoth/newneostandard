<div align="center">
  <img
    src="assets/neostandard3.svg"
    width="650"
    height="auto"
    alt="neostandard"
  />
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/newneostandard.svg?style=flat)](https://www.npmjs.com/package/newneostandard)
[![npm downloads](https://img.shields.io/npm/dm/newneostandard.svg?style=flat)](https://www.npmjs.com/package/newneostandard)
[![neostandard javascript style](https://img.shields.io/badge/neo-standard-7fffff?style=flat\&labelColor=ff80ff)](https://github.com/nichoth/newneostandard)

A spiritual successor to the [`standard`](https://github.com/standard/standard)
javascript style guide.

</div>

## Fork

This is a fork of [neostandard](https://github.com/neostandard/neostandard),
updated to work with eslint version 10.

## Table of Contents

- [Quick Start](#quick-start)
  - [Migrate from `standard`](#migrate-from-standard)
  - [Add to new project](#add-to-new-project)
- [Configuration options](#configuration-options)
- [Extending](#extending)
  - [Adding back import checking](#adding-back-import-checking)
- [Additional exports](#additional-exports)
  - [resolveIgnoresFromGitignore()](#resolveignoresfromgitignore)
  - [Exported plugins](#exported-plugins)
    - [List of exported plugins](#list-of-exported-plugins)
    - [Usage of exported plugin](#usage-of-exported-plugin)
- [Missing for 1.0.0 release](#missing-for-100-release)
- [Differences to standard / eslint-config-standard 17.x](#differences-to-standard--eslint-config-standard-17x)
  - [Relaxed rules](#relaxed-rules)
- [Config helper](#config-helper)
  - [Config migration](#config-migration)
- [Readme badges](#readme-badges)
- [Mission statement](#mission-statement)
  - [Rule guidelines](#rule-guidelines)
- [Governance](#governance)
- [Used by](#used-by)

## Quick Start

### Migrate from `standard`

1. `npm install -D newneostandard eslint`
2. (Validate that it runs cleanly by running `npx newneostandard --help`, see [#267](https://github.com/neostandard/neostandard/issues/267))
3. `npx newneostandard --migrate > eslint.config.js` (uses our [config helper](#config-helper))
4. Replace `standard` with `eslint` in all places where you run `standard`, eg. `"scripts"` and `.github/workflows/` (`neostandard` CLI tracked in [#2](https://github.com/neostandard/neostandard/issues/2))
5. (Add ESLint editor integration, eg. [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint))
6. Cleanup:
   * `npm uninstall standard`
   * Remove unused `"standard"` top level key from your `package.json`
   * Deactivate `standard` specific integrations if you no longer use them (eg. [vscode-standard](https://marketplace.visualstudio.com/items?itemName=standard.vscode-standard)))

### Add to new project

1. `npm install -D newneostandard eslint`
2. Add an `eslint.config.js`:

   Using config helper:

   ```sh
   npx newneostandard --esm > eslint.config.js
   ```

   Or to get CommonJS:

   ```sh
   npx newneostandard > eslint.config.js
   ```

   Or manually create the file as ESM:

   ```js
   import neostandard from 'newneostandard'

   export default neostandard({
     // options
   })
   ```

   Or as CommonJS:

   ```js
   module.exports = require('newneostandard')({
     // options
   })
   ```
3. Run `newneostandard` by running ESLint, eg. using `npx eslint`, `npx eslint --fix` or similar

## Configuration options

All examples below use **ESM (ECMAScript Modules)** syntax. If you're using **CommonJS (CJS)**, replace the `import`/`export` statements with the following:

  ```js
  // Replace
  import neostandard from 'newneostandard'
  export default neostandard({ /* options */ })

  // With
  const neostandard = require('newneostandard')
  module.exports = neostandard({ /* options */ })
  ```

Here's a basic example of how to configure `newneostandard`:

  ```js
  import neostandard from 'newneostandard'

  export default neostandard({
    ts: true,  // an option
    // Add other options here
  })
  ```

The options below allow you to customize `newneostandard` for your project. Use them to add global variables, ignore files, enable TypeScript support, and more.

* `env` - *`string[]`* - adds additional globals by importing them from the [globals](https://www.npmjs.com/package/globals) npm module
  
  ```js
  import neostandard from 'newneostandard'

  export default neostandard({
    env: ['browser', 'mocha'],  // Add browser and mocha global variables
  })
  ```

* `files` - *`string[]`* - additional file patterns to match. Uses the same shape as ESLint [`files`](https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores)
  
  ```js
  import neostandard from 'newneostandard'

  export default neostandard({
    files: ['src/**/*.js', 'tests/**/*.js'],  // Lint only files in src/ and tests/ directories
  })
  ```

* `filesTs` - *`string[]`* - additional file patterns for the TypeScript configs to match. Uses the same shape as ESLint [`files`](https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores)
  
  ```js
  import neostandard from 'newneostandard'

  export default neostandard({
    ts: true,   // Enable TypeScript support
    filesTs: ['src/**/*.ts', 'tests/**/*.ts'],  // Lint only TypeScript files in src/ and tests/ directories
  })
  ```
  
* `globals` - *`string[] | object`* - an array of names of globals or an object of the same shape as ESLint [`languageOptions.globals`](https://eslint.org/docs/latest/use/configure/language-options#using-configuration-files)
  
  Using an array:

  ```js
  import neostandard from 'newneostandard'

  export default neostandard({
    globals: ['$', 'jQuery'],  // Treat $ and jQuery as global variables
  })
  ```

  Using an object:

  ```js
  import neostandard from 'newneostandard'

  export default neostandard({
    globals: {
      $: 'readonly',  // $ is a read-only global
      jQuery: 'writable',  // jQuery can be modified
      localStorage: 'off',  // Disable the localStorage global
    },
  })
  ```

* `ignores` - *`string[]`* - an array of glob patterns for files that the config should not apply to, see [ESLint documentation](https://eslint.org/docs/latest/use/configure/ignore) for details
  
  ```js
  import neostandard from 'newneostandard'

  export default neostandard({
    ignores: ['dist/**/*', 'tests/**'],  // Ignore files in dist/ and tests/ directories
  })
  ```

* `noJsx` - *`boolean`* - if set, no jsx rules will be added. Useful if for some reason its clashing with your use of JSX-style syntax
  
  ```js
  import neostandard from 'newneostandard'

  export default neostandard({
    noJsx: true,  // Disable JSX-specific rules
  })
  ```

* `noStyle` - *`boolean`* - if set, no style rules will be added. Especially useful when combined with [Prettier](https://prettier.io/), [dprint](https://dprint.dev/) or similar
  
  ```js
  import neostandard from 'newneostandard'

  export default neostandard({
    noStyle: true,  // Disable style-related rules (useful with Prettier or dprint)
  })
  ```

* `semi` - *`boolean`* - if set, enforce rather than forbid semicolons (same as `semistandard` did)
  
  ```js
  import neostandard from 'newneostandard'

  export default neostandard({
    semi: true,  // Enforce semicolons (like semistandard)
  })
  ```
  
* `ts` - *`boolean`* - if set, TypeScript syntax will be supported and `*.ts` (including `*.d.ts`) will be checked. To add additional file patterns to the TypeScript checks, use `filesTs`
  
  ```js
  import neostandard from 'newneostandard'

  export default neostandard({
    ts: true,  // Enable TypeScript support and lint .ts files
  })
  ```

## Extending

The `newneostandard()` function returns an ESLint config array which is intended to be exported directly or, if you want to modify or extend the config, can be [combined with other configs](https://eslint.org/docs/latest/use/configure/combine-configs) like any other ESLint config array:

```js
import neostandard from 'newneostandard'
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  ...neostandard(),
  jsdoc.configs['flat/recommended-typescript-flavor'],
]
```

Do note that `newneostandard()` is intended to be a complete linting config in itself, only extend it if you have needs that goes beyond what `newneostandard` provides, and [open an issue](https://github.com/nichoth/newneostandard/issues) if you believe `newneostandard` itself should be extended or changed in that direction.

It's recommended to stay compatible with the plain config when extending and only make your config stricter, not relax any of the rules, as your project would then still pass when using just the plain `newneostandard`-config, which helps people know what baseline to expect from your project.

### Adding back import checking

As of newneostandard v0.13.0, `eslint-plugin-import-x` has been removed to reduce dependency weight and installation complexity. For most projects, TypeScript's compiler (`tsc`) provides superior import/export checking with full project context.

If you still need ESLint-based import checking, you can add it back manually:

```js
import neostandard from 'newneostandard'
import importX from 'eslint-plugin-import-x'

export default [
  ...neostandard(),
  {
    plugins: {
      'import-x': importX
    },
    rules: {
      'import-x/export': 'error',
      'import-x/first': 'error',
      'import-x/no-absolute-path': ['error', { esmodule: true, commonjs: true, amd: false }],
      'import-x/no-duplicates': 'error',
      'import-x/no-named-default': 'error',
      'import-x/no-webpack-loader-syntax': 'error',
    }
  }
]
```

For TypeScript projects, you may also want to add the TypeScript resolver:

```js
import neostandard from 'newneostandard'
import importX from 'eslint-plugin-import-x'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'

export default [
  ...neostandard(),
  {
    plugins: {
      'import-x': importX
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: './tsconfig.json'
        })
      ]
    },
    rules: {
      'import-x/export': 'error',
      'import-x/first': 'error',
      'import-x/no-absolute-path': ['error', { esmodule: true, commonjs: true, amd: false }],
      'import-x/no-duplicates': 'error',
      'import-x/no-named-default': 'error',
      'import-x/no-webpack-loader-syntax': 'error',
    }
  }
]
```

**Recommended alternative:** Use TypeScript's compiler for import checking instead:

```bash
tsc --noEmit
```

This provides more comprehensive checking including type imports, module resolution, and cross-file validation.

## Additional exports

### resolveIgnoresFromGitignore()

Finds a `.gitignore` file that resides in the same directory as the ESLint config file and returns an array of ESLint ignores that matches the same files.

ESM:

```js
import neostandard, { resolveIgnoresFromGitignore } from 'newneostandard'

export default neostandard({
  ignores: resolveIgnoresFromGitignore(),
})
```

CommonJS:

```js
module.exports = require('newneostandard')({
  ignores: require('newneostandard').resolveIgnoresFromGitignore(),
})
```

### Exported plugins

`newneostandard` exports all the ESLint plugins that it uses. This to ensure that users who need to reference the plugin themselves will use the exact same instance of the plugin, which is a necessity when a plugin prefix is defined in multiple places.

#### List of exported plugins

* `@stylistic` - export of [`@stylistic/eslint-plugin`](https://npmjs.com/package/@stylistic/eslint-plugin)
* `n` - export of [`eslint-plugin-n`](https://npmjs.com/package/eslint-plugin-n)
* `promise` - export of [`eslint-plugin-promise`](https://npmjs.com/package/eslint-plugin-promise)
* `react` - export of [`eslint-plugin-react`](https://npmjs.com/package/eslint-plugin-react)
* `typescript-eslint` - export of [`typescript-eslint`](https://npmjs.com/package/typescript-eslint)

#### Usage of exported plugin

If one eg. wants to add the `eslint-plugin-n` recommended config, then one can do:

```js
import neostandard, { plugins } from 'newneostandard'

export default [
  ...neostandard(),
  plugins.n.configs['flat/recommended'],
]
```

## Missing for 1.0.0 release

* Investigate a dedicated `neostandard` runner: [#33](https://github.com/neostandard/neostandard/issues/33) / [#2](https://github.com/neostandard/neostandard/issues/2)

Full list in [1.0.0 milestone](https://github.com/neostandard/neostandard/milestone/1)

## Differences to standard / eslint-config-standard 17.x

* [Open governance](./GOVERNANCE.md), resolving [governance issue](https://github.com/standard/standard/issues/1948#issuecomment-2138078249)
* Built for [ESLint 10](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/)
* Relies on [ESLint flat config](https://eslint.org/blog/2023/10/flat-config-rollout-plans/) to bundle plugins rather than custom [`standard-engine`](https://github.com/standard/standard-engine)
* Replaces [deprecated ESLint style rules](https://eslint.org/blog/2023/10/deprecating-formatting-rules/) with [`eslint-stylistic`](https://eslint.style/) rules
* Defaults to the `standard` behaviour of bundling JSX-support (ported from [`eslint-config-standard-jsx`](https://github.com/standard/eslint-config-standard-jsx)) with a `noJsx` option that deactivates it to match `eslint-config-standard`
* Built in options replaces need for separate modules
  * `ts` option makes `*.ts` files be checked as well (used to be handled by [`ts-standard`](https://github.com/standard/ts-standard))
  * `semi` option enforces rather than ban semicolons (used to be handled by [`semistandard`](https://github.com/standard/semistandard))
  * `noStyle` option deactivates style rules (used to require something like [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier))

### Relaxed rules

* [`@stylistic/comma-dangle`](https://eslint.org/docs/rules/comma-dangle) – *changed* – set to ignore dangling commas in arrays, objects, imports, exports and is it set to `warn` rather than `error`
* [`@stylistic/no-multi-spaces`](https://eslint.org/docs/rules/no-multi-spaces) – *changed* – sets `ignoreEOLComments` to `true`, useful for aligning comments across multiple line
* [`dot-notation`](https://eslint.org/docs/rules/dot-notation) – *deactivated* – clashes with the [`noPropertyAccessFromIndexSignature`](https://www.typescriptlang.org/tsconfig#noPropertyAccessFromIndexSignature) check in TypeScript
* [`n/no-deprecated-api`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-deprecated-api.md) – *changed* – changed to `warn` instead of `error` as they are not urgent to fix

## Config helper

You can use the provided CLI tool to generate a config for you:

```sh
newneostandard --semi --ts > eslint.config.js
```

To see all available flags, run:

```sh
newneostandard --help
```

### Config migration

The CLI tool can also migrate an existing `"standard"` configuration from `package.json`:

```sh
newneostandard --migrate > eslint.config.js
```

Migrations can also be extended, so to eg. migrate a `semistandard` setup, do:

```sh
newneostandard --semi --migrate > eslint.config.js
```

## Readme badges

Yes! If you use `newneostandard` in your project, you can include one of these badges in
your readme to let people know that your code is using the newneostandard style.

[![neostandard javascript style](https://img.shields.io/badge/neo-standard-7fffff?style=flat\&labelColor=ff80ff)](https://github.com/nichoth/newneostandard)

```md
[![neostandard javascript style](https://img.shields.io/badge/neo-standard-7fffff?style=flat&labelColor=ff80ff)](https://github.com/nichoth/newneostandard)
```

[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-7fffff?style=flat\&labelColor=ff80ff)](https://github.com/nichoth/newneostandard)

```md
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-7fffff?style=flat&labelColor=ff80ff)](https://github.com/nichoth/newneostandard)
```

[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/nichoth/newneostandard)

```md
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/nichoth/newneostandard)
```

## Mission statement

_Prior to the `1.0.0` release we are still rapidly evolving with fixes and improvements to reach rule parity with `standard`, hence more breaking changes will be experienced until then, as well as evolution of this statement_

`newneostandard` intends to set an expectable baseline for project linting that's _descriptive_ of best practices rather than _prescriptive_ of any opinionated approach.

### Rule guidelines

1. `newneostandard` rules _describes_ current best practices in the community and help align developers, contributors and maintainers along those
2. `newneostandard` rules _are not_ a tool to promote changed practices within the community by _prescribing_ new such practices
3. `newneostandard` rule changes and additions should be aligned with projects prior to being released, by eg. sending PR:s to them to align them ahead of time. When new best practices are incompatible with current best practices, rules should first be relaxed to allow for both approaches, then be made stricter when the community has moved to the new approach
4. `newneostandard` rule changes and additions should improve the _description_ of project best practices, not _prescribe_ new practices
5. `newneostandard` should, when faced with no clear best practice, avoid adding such a rule as it risks becoming _prescriptive_ rather than _descriptive_. If leaving out such a rule would make `newneostandard` an incomplete baseline config, and the community is split between a few clear alternatives (such as `semi`), then making it configurable can enable it to still be added, but that should only be done in exceptional cases

## Governance

`neostandard` is a community project with open governance.

See [GOVERNANCE.md](./GOVERNANCE.md) for specifics.

## Used by

A subset of some of the projects that rely on `neostandard`:

* [`bcomnes/npm-run-all2`](https://github.com/bcomnes/npm-run-all2) (https://github.com/bcomnes/npm-run-all2/pull/142)
* [`fastify/fastify`](https://github.com/fastify/fastify) (https://github.com/fastify/fastify/pull/5509)
* [`nodejs/undici`](https://github.com/nodejs/undici) (https://github.com/nodejs/undici/pull/3485)
* [`poolifier/poolifier`](https://github.com/poolifier/poolifier)
* [`uuidjs/uuid`](https://github.com/uuidjs/uuid) (https://github.com/uuidjs/uuid/pull/752)

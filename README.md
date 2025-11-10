<h1 align="center">eslint-plugin-erasable-syntax-only</h1>

<p align="center">
	ESLint plugin to granularly enforce TypeScript's <a href="https://devblogs.microsoft.com/typescript/announcing-typescript-5-8-rc/#the---erasablesyntaxonly-option"><code>erasableSyntaxOnly</code></a> flag.
	❎
</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 4" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-4-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
	<a href="http://npmjs.com/package/eslint-plugin-erasable-syntax-only" target="_blank"><img alt="📦 npm version" src="https://img.shields.io/npm/v/eslint-plugin-erasable-syntax-only?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

## Usage

Add this plugin to the list of plugins in your [ESLint configuration file](https://eslint.org/docs/latest/use/configure/configuration-files):

```shell
npm i eslint-plugin-erasable-syntax-only -D
```

```ts
import eslint from "@eslint/js";
import erasableSyntaxOnly from "eslint-plugin-erasable-syntax-only";
import tseslint from "typescript-eslint";

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	erasableSyntaxOnly.configs.recommended, // 👈
);
```

### Rules

These are all set to `"error"` in the recommended config:

<!-- begin auto-generated rules list -->

💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

| Name                                                       | Description                                          | 💡  |
| :--------------------------------------------------------- | :--------------------------------------------------- | :-- |
| [enums](docs/rules/enums.md)                               | Avoid using TypeScript's enums.                      | 💡  |
| [import-aliases](docs/rules/import-aliases.md)             | Avoid using TypeScript's import aliases.             | 💡  |
| [namespaces](docs/rules/namespaces.md)                     | Avoid using TypeScript's namespaces.                 |     |
| [parameter-properties](docs/rules/parameter-properties.md) | Avoid using TypeScript's class parameter properties. |     |

<!-- end auto-generated rules list -->

> This plugin requires ESLint >=9 and Node.js >=20.18.0.

## What?

`eslint-plugin-erasable-syntax-only` is an [ESLint plugin](https://eslint.org/docs/latest/use/configure/plugins).
It provides rules that report on using syntax that will not be allowed by TypeScript's [`--erasableSyntaxOnly` option](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8-beta/#the---erasablesyntaxonly-option):

> Recently, Node.js 23.6 unflagged [experimental support for running TypeScript files directly](https://nodejs.org/api/typescript.html#type-stripping); however, only certain constructs are supported under this mode.
>
> ...
>
> TypeScript 5.8 introduces the `--erasableSyntaxOnly` flag.
> When this flag is enabled, TypeScript will only allow you to use constructs that can be erased from a file, and will issue an error if it encounters any constructs that cannot be erased.

## Why?

If you've already enabled TypeScript's `--erasableSyntaxOnly` option then you do not need this plugin.

However, if you have many existing violations, it can be time-consuming to enable TypeScript options like `--erasableSyntaxOnly`.
TypeScript compiler options can only be configured widely at the TSConfig-level, not granularly per-file.

`eslint-plugin-erasable-syntax-only` allows for more gradual migrations towards only using erasable syntax.
It allows you to:

- Enable only one rule at a time
- Restrict which rules apply to which files
- Use granular ESLint [`eslint-disable` comments](https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments-1) instead of [`// @ts-expect-error`s](https://www.learningtypescript.com/articles/comment-directives#ts-expect-error)

For example, this config avoids banning enums in specific files:

```ts
import erasableSyntaxOnly from "eslint-plugin-erasable-syntax-only";
import tseslint from "typescript-eslint";

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	erasableSyntaxOnly.configs.recommended,
	// TODO (#...)
	{
		files: ["src/some/files/*.ts"],
		rules: {
			"erasable-syntax-only/enums": "off",
		},
	},
);
```

> [!TIP]
> Put a _TODO_ comment linking to a tracking issue/ticket on any temporary disables of rules.
> It will help keep track of pending work and indicate when rule disables aren't meant to stay long-term.

### See Also

- [`@typescript-eslint/no-namespace`](https://typescript-eslint.io/rules/no-namespace): Dedicated, more granular typescript-eslint rule for reporting `namespace`s
- [`@typescript-eslint/parameter-properties`](https://typescript-eslint.io/rules/parameter-properties): Dedicated, more granular typescript-eslint rule for parameter properties

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! ❎

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AlexMunoz"><img src="https://avatars.githubusercontent.com/u/3093946?v=4?s=100" width="100px;" alt="Alex Muñoz"/><br /><sub><b>Alex Muñoz</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only/commits?author=alexmunoz" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://jakebailey.dev"><img src="https://avatars.githubusercontent.com/u/5341706?v=4?s=100" width="100px;" alt="Jake Bailey"/><br /><sub><b>Jake Bailey</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only/issues?q=author%3Ajakebailey" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com/"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#content-JoshuaKGoldberg" title="Content">🖋</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#projectManagement-JoshuaKGoldberg" title="Project Management">📆</a> <a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only/issues?q=author%3AJoshuaKGoldberg" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/cylewaitforit"><img src="https://avatars.githubusercontent.com/u/54253392?v=4?s=100" width="100px;" alt="cylewaitforit"/><br /><sub><b>cylewaitforit</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only/commits?author=cylewaitforit" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

> 💝 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) using the [Bingo engine](https://create.bingo).

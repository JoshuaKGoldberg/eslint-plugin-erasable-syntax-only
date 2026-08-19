# export-aliases

📝 Avoid using TypeScript's export aliases.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

Enforces that code doesn't use TypeScript's `export =`s:

## Invalid Code

```ts
export = values;
```

## Valid Code

```ts
export default values;
```

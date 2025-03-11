# erasable-syntax-only/enums

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

Enforces that code doesn't use TypeScript's `enum`s:

## Invalid Code

```ts
enum Values {}
```

## Valid Code

```ts
const Values {
} as const

type Values = typeof Values[keyof typeof Values];`,
```

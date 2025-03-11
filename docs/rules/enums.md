# erasable-syntax-only/enums

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

# erasable-syntax-only/parameter-properties

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

Enforces that code doesn't use TypeScript's class parameter properties:

## Invalid Code

```ts
class Values {
	constructor(readonly value: number) {}
}
```

## Valid Code

```ts
class Values {
	readonly value: number;
	constructor(value: number) {
		this.value = value;
	}
}
```

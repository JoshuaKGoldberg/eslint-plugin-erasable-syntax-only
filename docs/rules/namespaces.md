# namespaces

📝 Avoid using TypeScript's namespaces.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

Enforces that code doesn't use TypeScript's `namespaces` with values:

## Invalid Code

```ts
module Values {
	export const value = "a";
}

namespace Values {
	export const value = "a";
}
```

## Valid Code

```ts
module Values {
	export type Value = "a";
}

namespace Values {
	export type Value = "a";
}
```

```ts
const Values = {
	value: "a",
};
```

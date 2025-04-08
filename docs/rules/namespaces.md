# namespaces

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

# erasable-syntax-only/namespaces

<!-- end auto-generated rule header -->

Enforces that code doesn't use TypeScript's `namespaces` with values:

```ts
module Values {
	export const value = "a";
}

namespace Values {
	export const value = "a";
}
```

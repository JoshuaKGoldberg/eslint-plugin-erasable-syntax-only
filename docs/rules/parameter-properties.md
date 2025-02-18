# erasable-syntax-only/parameter-properties

<!-- end auto-generated rule header -->

Enforces that code doesn't use TypeScript's class parameter properties:

# Invalid Code

```ts
class Values {
	constructor(readonly value: number) {}
}
```

# Valid Code

```ts
class Values {
	constructor(value: number) {}
}
```

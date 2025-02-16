# erasable-syntax-only/import-aliases

<!-- end auto-generated rule header -->

Enforces that code doesn't use TypeScript's `import ... =`s:

## Invalid Code

```ts
import values = require("values");
```

## Valid Code

```ts
import values from "values";
```

# import-aliases

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

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

```ts
import * as values from "values";
```

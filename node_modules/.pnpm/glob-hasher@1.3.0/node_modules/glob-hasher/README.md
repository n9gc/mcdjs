# glob-hasher

A library that will glob for files and return the xxhash in u64 / BigInt as a JS library. It takes advantage of napi-rs to interop with the libraries doing the heavy lifting of both globbing and hashing. `xxhash-rust`, `ignore` crates are used here.

## API

```js
import { hashGlob, hashGlobParallel } from "glob-hasher";

// Glob and hash with 16 threads
hashGlobParallel(["**/*.ts", "!**/node_modules/**"], {
  cwd: "some/path",
  concurrency: 16
});

// Glob and hash only with one core, using .gitignore to filter the glob
hashGlob(["**/*.ts"], {
  cwd: "some/path",
  gitignore: true
});
```

## Releasing

Be sure to use `npm version` to create a new git tag.
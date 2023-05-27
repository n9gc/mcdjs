# Aocudeo

*An Organizer of Code Units that Depend on Each Other* - *Aocudeo*, can load your interdependent modules with the correct order through the dependency list registered by each of modules.
It can also be used to organize your pipelining work.

## Usage

### Basic Useful

1. Get a public loader for your modules.

   ```ts
   import Loader from 'aocudeo';

   export const loader = new Loader();
   ```

2. Use loader's APIs to register the module ID and dependencies' ID in each of your modules.

   Such as:

   ```ts
   loader
     .insert('myMod', {
       after: ['toolMod', 'baseMod'],
       before: 'endMod',
     })
     .addAct('myMod', () => {
       console.log('Loading myMod');
     });
   ```

3. Run modules all.

4. ```ts
   loader.load();
   ```

### Pipeline

Do what *p-graph*'s sample code do.

```ts
import { LoaderAsync, PosMap } from 'aocudeo';

const actMap = new Map([
  ["putOnShirt", { run: () => Promise.resolve("put on your shirt") }],
  ["putOnShorts", { run: () => Promise.resolve("put on your shorts") }],
  ["putOnJacket", { run: () => Promise.resolve("put on your jacket") }],
  ["putOnShoes", { run: () => Promise.resolve("put on your shoes") }],
  ["tieShoes", { run: () => Promise.resolve("tie your shoes") }],
]);

const dependencies: PosMap = {
  // You need to put your shoes on before you tie them!
  "putOnShoes": { before: "tieShoes" },
  "putOnShirt": { before: "putOnJacket" },
  "putOnJacket": { after: "putOnShorts" },
  "putOnShorts": { before: "putOnShoes" },
};

await new LoaderAsync<void>(actMap, dependencies).load();
```

## Links

- [p-graph](https://github.com/microsoft/p-graph) - Functionally similar to this package.

# Aocudeo

通过各个模块提供的位置信息，本包可用于自动以正确的流程加载加载相互依赖的模块。
作为延伸，本包也能用来组织代码流程。

*An Organizer of Code Units that Depend on Each Other* - *Aocudeo*, can load your interdependent modules with the correct order through the dependency list registered by each of modules.
It can also be used to organize your pipelining work.

## 用例 Usage

### 通常用法 Basic Usage

1. 弄个加载器用来加载模块。

   Get a public loader for your modules.

   ```ts
   import Loader from 'aocudeo';

   export const loader = new Loader();
   ```

2. 根据模块标识符和位置信息插入模块。

   Use loader's APIs to register the module ID and dependencies' ID in each of your modules.

   Such as:

   ```ts
   loader
     .insert('myMod', {
       after: ['toolMod', 'baseMod'],
       before: 'endMod',
     })
     .addAction('myMod', () => {
       console.log('Loading myMod');
     });
   ```

3. 把模块都运行一遍，确保所有模块都已被插入。

   Run modules all to make sure all of your modules have been registered.

4. ```ts
   loader.load();
   ```

### 流程工作 Pipeline

借以 *p-graph* 的示例代码为例。

Do what *p-graph*'s sample code do.

```ts
import { LoaderAsync, Positions } from 'aocudeo';

const actions = new Map([
  ["putOnShirt", { run: () => Promise.resolve("put on your shirt") }],
  ["putOnShorts", { run: () => Promise.resolve("put on your shorts") }],
  ["putOnJacket", { run: () => Promise.resolve("put on your jacket") }],
  ["putOnShoes", { run: () => Promise.resolve("put on your shoes") }],
  ["tieShoes", { run: () => Promise.resolve("tie your shoes") }],
]);

const positions: Positions = [
  // You need to put your shoes on before you tie them!
  ["putOnShoes", "tieShoes"],
  ["putOnShirt", "putOnJacket"],
  ["putOnShorts", "putOnJacket"],
  ["putOnShorts", "putOnShoes"],
];

await new LoaderAsync<void>({ actions, positions }).load();
```

## 链接 Links

- [p-graph](https://github.com/microsoft/p-graph)
  
  功能上与本包类似。

  Functionally similar to this package.

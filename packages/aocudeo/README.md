# Aocudeo

[![github action](https://github.com/n9gc/mcdjs/actions/workflows/test-all.yml/badge.svg)](https://github.com/n9gc/mcdjs/actions)
[![github action](https://github.com/n9gc/mcdjs/actions/workflows/dobuild.yml/badge.svg)](https://github.com/n9gc/mcdjs/actions)
[![Coverage Status](https://coveralls.io/repos/github/n9gc/mcdjs/badge.svg?branch=x-cov-aocudeo)](https://coveralls.io/github/n9gc/mcdjs?branch=x-cov-aocudeo)

通过注册位置信息并在其上绑定工作器回调，本包可用于以正确的顺序组织异步或同步代码流程。

*An Organizer of Code Units that Depend on Each Other* - *Aocudeo*, can organize your pipelining work with the correct order through the 'Position' registered by 'Workers'.
It can also be used to organize your pipelining work.

## 用例 Usage

### 加载插件 Loading Plugins

1. 在索引模块中弄个加载器用来加载模块。

   Get a public loader for your plugins in the index.

   ```ts
   import Loader from 'aocudeo/async';

   export const loader = new Loader({ reuseable: false });
   ```

2. 根据插件名称和位置信息插入插件。

   Insert the plugin with its name and dependencies' name.

   ```ts
   loader
     .addPosition('foo', {
       after: ['bar', 'baz'],
       preOf: 'foobar',
     })
     .addWorker('foo', async () => {
       await import('./plugins/foo.ts');
     });
   ```

3. ```ts
   loader.execute();
   ```

### 简单流程工作 Simple Pipeline Work

借以 *p-graph* 的示例代码为例。

Do what *p-graph*'s sample code do.

```ts
import Organizer, { Positions } from 'aocudeo/async';

const workers = new Map([
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

await new Organizer({ workers, positions }).execute();
```

### 流水线处理 Pipeline Process

以下这个用例导出一个用于得到一个穿好衣服的人的函数 `getPerson` 。

The following usage exports `getPerson` to obtain a person dressed properly.

```ts
import Organizer from "../../async";

export interface Person {
  shorts?: 'shorts';
  shoes?: 'shoes';
  tied: boolean;
}

const organizer = new Organizer<Person>()
  .addPositions({
    putOnShoes: 'putOnShorts',
    tieShoes: { postOf: 'putOnShoes' },
  })
  .addWorkers({
    async putOnShorts({ data: person }) {
      person.shorts = await Promise.resolve('shorts');
    },
    async putOnShoes({ data: person }) {
      person.shoes = await Promise.resolve('shoes');
    },
    async tieShoes({ data: person }) {
      person.tied = await Promise.resolve(true);
    },
  });

export async function getPerson() {
  return await organizer.execute({ tied: false });
}
```

## 链接 Links

- [p-graph](https://github.com/microsoft/p-graph)

  功能上与本包类似。

  Functionally similar to this package.

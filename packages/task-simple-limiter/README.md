# Task Simple Limiter

[![github action](https://github.com/n9gc/mcdjs/actions/workflows/test-all.yml/badge.svg)](https://github.com/n9gc/mcdjs/actions)
[![github action](https://github.com/n9gc/mcdjs/actions/workflows/dobuild.yml/badge.svg)](https://github.com/n9gc/mcdjs/actions)
[![Coverage Status](https://coveralls.io/repos/github/n9gc/mcdjs/badge.svg?branch=x-cov-aocudeo)](https://coveralls.io/github/n9gc/mcdjs?branch=x-cov-task-simple-limiter)

本包可以方便的给异步任务限流，也就是并发控制。

*Task Simple Limiter* can control your tasks concurrency conveniently.

## 用例 Usage

### 初始化 Initialization

```ts
import Limiter from 'task-simple-limiter';

const limiter = new Limiter({ concurrency: 2 });
```

### 阻塞任务来限流 Blocking Task

```ts
async function task() {
  await limiter.hold();
  await somethingAsync();
  limiter.release();
}
```

相当于

Equal to

```ts
limiter.hold()
  .then(somethingAsync)
  .finally(() => limiter.release());
```

## 链接 Links

- [concurrency-limiter](https://github.com/juju/concurrency-limiter)

  限制并发的实现方式与本包类似。

  The way to control concurrency is similar to this package.

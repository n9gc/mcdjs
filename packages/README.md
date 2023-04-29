# McdJS 相关包简介目录

本项目使用 pnpm + truborepo 实现的 monorepo 模式，包含很多包。

- ## [`mcdjs`](/packages/mcdjs) 主包

  大部分的核心代码位于此包中。

- ## [`mcdjs-cli`](/packages/mcdjs-cli/) 命令行工具

  就像 `webpack` 与 `webpack-cli` 的关系一样，安装本包不会附带安装主包，但是如果不安装本包，你就无法在终端中输入命令来使用 McdJS 。

- ## [`@mcdjs/base`](/packages/base/) 通用工具库

  包含各种 McdJS 相关包需要的工具。

- ## [`@mcdjs/errlib`](/packages/errlib/) 错误处理库

  包含 McdJS 错误处理相关的函数和定义。

- ## ## [`@mcdjs/types`](/packages/types/) 类型工具库

  包含各种类型工具，十分实用。

- ## [`aocudeo`](/packages/aocudeo/) 胡乱加载器

  通过在模块中使用本工具注册模块自身和所依赖模块的标识符，即使依赖关系比较混乱，也可以把模块一股脑都加载上——它会给你找到正确的顺序进行加载。

  出于可拓展性和开发的便利方面需要，本项目有一部分代码是在环境模块里通过合并全局命名空间 `McdJSTemp` 来组织的。
  本工具就用以加载此类代码。

- ## [`devok`](/packages/dev/) Dev OK! 开发工具套装

  这些工具使开发 McdJS 这个 monorepo 模式的复杂 TS 项目不再令人产生极大的抗拒心理。

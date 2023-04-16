# McdJS 相关包简介目录

本项目使用 pnpm + truborepo 实现的 monorepo 模式，包含很多包。

- ## [`mcdjs`](/packages/mcdjs) 主包
  
  大部分的核心代码位于此包中。

- ## [`mcdjs-cli`](/packages/mcdjs-cli/) 命令行工具

  就像 `webpack` 与 `webpack-cli` 的关系一样，安装本包不会附带安装主包，但是如果不安装本包，你就无法在终端中输入命令来使用 McdJS 。

- ## [`@mcdjs/base`](/packages/base/) 通用工具库

  本包是大部分 McdJS 相关包依赖的库。

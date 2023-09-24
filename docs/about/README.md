# 介绍

*McdJS* 全称 *JavaScript minecraft command generator with the idea of the Minecraft Command Design* 也就是“《MC指令设计》配套 JS 指令生成工具”。

本工具使用《MC 指令设计》系列教程中的思想对我的世界指令进行抽象，将我的世界指令变得简单易懂，符合逻辑。
同时，你还可以享受到 JavaScript / TypeScript 生态所带来的便利，例如编辑器代码提示、持续部署、版本控制等。

本项目是基于[《MC指令设计》系列教程](https://github.com/n9gc/the-minecraft-command-design) 中的思想的一个激动人心的计划的一部分。

在得到各种繁多的指令设计模式后，我们为何不使用更简洁的语言来描述指令，最终使用某种解析器搭配指令设计模式对其中的细节进行补全，来实现“指令生成”的效果呢？

> 相对于手动使用设计模式进行重复性劳动，将设计模式套入程序中生成指令无疑是生产力的大进步。
>
> 我希望可以借助这个项目代替我编写指令，我的注意力便可从“使用设计模式”移到“发现更多设计模式并应用到这个项目”。
>
> 如果大家都把使用设计模式的精力放到发现设计模式上，就像共产主义摆脱了低级劳动，那一定是《MC设计模式》的新世纪。

---

本项目使用 pnpm + truborepo 实现的 monorepo 模式，包含很多 npm 包。

## [`mcdjs`](https://github.com/n9gc/mcdjs/blob/HEAD/packages/mcdjs) 主包

大部分的核心代码位于此包中。

![McdJS 架构图](../../packages/mcdjs/lib/arch.puml ':class=img-puml :size=50%')

## [`mcdjs-cli`](https://github.com/n9gc/mcdjs/blob/HEAD/packages/mcdjs-cli/) 命令行工具

在主包 `mcdjs` 的基础上，本包提供了在终端中输入命令来使用 McdJS 相关的命令行工具。

## [`aocudeo`](https://github.com/n9gc/mcdjs/blob/HEAD/packages/aocudeo/) 胡乱加载器

通过在模块中使用本工具注册模块自身和所依赖模块的标识符，即使依赖关系比较混乱，也可以把模块一股脑都加载上——它会给你找到正确的顺序进行加载。

出于可拓展性和开发的便利方面需要，本项目有一部分代码是在环境模块里通过合并全局命名空间 `McdJSTemp` 来组织的。
本工具就用以加载此类代码。

![Aocudeo 架构图](../../packages/aocudeo/lib/arch.puml  ':class=img-puml :size=50%')

## [`devok`](https://github.com/n9gc/mcdjs/blob/HEAD/packages/dev/) Dev OK! 开发工具套装

这些工具使开发 McdJS 这个 monorepo 模式的复杂 TS 项目不再令人产生极大的抗拒心理。

<script src="scripts/puml.js"></script>

# ![McdJS](/packages/mcdjs/lib/banner.svg)

> 像写指令一样写 JS
>
> ——或者说，像写 JS 一样写指令 。

*McdJS* 全称 *JavaScript minecraft command generator with the idea of the Minecraft Command Design* 也就是“《MC指令设计》配套 JS 命令生成工具”。

本项目是基于[《MC指令设计》系列教程](https://github.com/n9gc/the-minecraft-command-design) 中的思想的一个激动人心的计划的一部分。

在得到各种繁多的指令设计模式后，我们为何不使用更简洁的语言来描述指令，最终使用某种解析器搭配指令设计模式对其中的细节进行补全，来实现“指令生成”的效果呢？

> 相对于手动使用设计模式进行重复性劳动，将设计模式套入程序中生成指令无疑是生产力的大进步。
> 我希望可以借助这个项目代替我编写指令，我的注意力便可从“使用设计模式”移到“发现更多设计模式并应用到这个项目”。
> 如果大家都把使用设计模式的精力放到发现设计模式上，就像共产主义摆脱了低级劳动，那一定是《MC设计模式》的新世纪。

## 安装

若想使用 McdJS 编写指令，首先你需要有一个 McdJS 编译器。
目前来说只有一种方法安装。

### 安装于本地

1. 本项目基本使用 JS 编写。
   要想在本地运行 JS 你首先需要安装 Node.js 环境。

   你可以到 [Node.js 官网](https://nodejs.org/zh-cn) 上找到匹配自己系统的版本，然后下载安装。

   配好 Node.js 环境的标志是打开终端（ linux 上为 bash 或 zsh ， Windows 上为 cmd.exe 或 powershell ）然后输入

   ```bash
   node -v
   ```

   如果得到了类似下方这种格式的版本号，或者只要没出什么一眼看起来是错误的错误，那基本就是配好了。

   ```text
   v19.8.1
   ```

2. 一般来说除了特殊需要（例如开发基于 McdJS API 的 JS 库）以外，可以选择使用命令行在终端进行编译。
   于是我们需要使用包管理器全局安装 McdJS 及其命令行工具。

   使用 npm 这个会和 Node.js 捆绑安装的包管理器进行安装：

   ```bash
   npm i mcdjs mcdjs-cli -g
   ```

3. 到此我们已可以通过命令行来使用 McdJS 了。
   像这样执行 `mcdjsc` 即可：

   ```bash
   mcdjsc -v
   ```

   一般来说此时会得到当前 McdJS 的版本。
   否则要不然是你安装坏了，要不然是本项目还没开发完……

[进一步了解本仓库](/packages/)

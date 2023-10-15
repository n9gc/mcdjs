# 补充内容

## 推荐的目录结构

当你的拓展库比较轻量级的时候，你可以把所有的全局定义和导出放到全局导出器中，类似以下这种目录结构：

```text
.
├── apis.ts             # API 相关
├── errors.ts           # 错误类型相关
├── exports.ts          # 全局导出器
├── generators.ts       # 生成器相关
├── genevents.ts        # 生成事件相关
├── index.ts            # 加载器
├── nodes.ts            # AST 节点类型相关
└── transformers.ts     # 转译器相关
```

?> 目录中不包含 `aliases.ts` ，这是因为节点别名不需要在模块中定义或导出，只需全局定义并导出，所以被合并到 `exports.ts` 中了。

当你的拓展库比较大，希望能尽量有条理，分类清晰时，你可以给拓展库的各个部分单独创建一个文件夹。
推荐再分别为文件夹添加导出器和加载器，来方便拓展库顶层加载器加载。

就像这样：

```text
.
├── aliases.ts
├── index.ts
├── apis
│   ├── ...
│   ├── exports.ts
│   └── index.ts
│
├─errors
│   ├── ...
│   ├── exports.ts
│   └── index.ts
│
├─generators
│   ├── ...
│   ├── exports.ts
│   └── index.ts
│
├─genevents
│   ├── ...
│   ├── exports.ts
│   └── index.ts
│
├─nodes
│   ├── ...
│   ├── exports.ts
│   └── index.ts
│
└─transformers
    ├── ...
    └── index.ts
```

## 全局代码相关

由于 TypeScript 独特的类型设计，想要充分利用类型系统带来的约束，就需要使用全局代码通过合并命名空间的方法拓展类型。

1. 实际开发中，并不推荐把东西都放在全局域，所以全局代码的用处只限于提供类型支持。
2. 为了防止产生混乱的引用关系， *全局代码* 只用于导出。不要通过 *McdJS* 提供的全局接口导入任何东西，比如其他拓展库的变量。
3. 由于之后可能会开发针对拓展库的打包程序，涉及到全局域的操作，所以尽量不要操作全局，例如声明全局函数等。

## 拓展库的命名规则

由于拓展库包含类型的拓展，所以开发拓展库时需要**严格**遵守命名规则，避免类型定义冲突导致的编译问题。
用 *MP about Process* 拓展库为例，具体规则如下：

1. 拓展库的名字最好由英文字母和空格构成，可以包含大写。例如 *MP about Process* 。
2. 拓展库的标识符名称应该为驼峰命名法，只有在名字中空格后那个的字母大写，例如 `mpAboutProcess` 。
3. 拓展库的转译器名称也应符合标识符名称的规则。若拓展库有多个转译器，则在标识符后使用冒号进行分割，例如 `"mpAboutProcess:commandPacker"` 、 `"mpAboutProcess:cleaner"` 。
4. 拓展库的生成器名称**推荐**也使用标识符名称的规则。若有多个生成器，则用驼峰命名法，例如 `mpAboutProcessStarter` 、 `mpAboutProcessCommandOuter` 。

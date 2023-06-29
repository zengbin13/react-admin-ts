## 初始化项目

```
pnpm create vite app-name --template react-ts
pnpm dev
```

### 配置初始化

```
pnpm add @types/node -D
```

#### 路径别名与解析

```js
// vite.config.js
resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
```

```json

"compilerOptions": {
    // 解析非相对模块名的基准目录
    "baseUrl": "./",
    // 模块名到基于 baseUrl的路径映射的列表
    "paths": {
      "@": [
        "src/*"
      ]
    }
}
```

### 样式初始化

#### 引入 [unocss](https://unocss.dev/)

> UnoCSS —— 即时原子 CSS 引擎 所有 CSS 实用程序都是通过预设提供的

```
pnpm add -D unocss
```

```js
import UnoCSS from 'unocss/vite';
export default defineConfig({
  plugins: [UnoCSS()]
});
```

创建配置文件 `uno.config.ts`

```ts
import { defineConfig } from 'unocss';
import presetUno from '@unocss/preset-uno';

export default defineConfig({
  //使用预设
  presets: [presetUno()]
});
```

添加`virtual:uno.css`

```ts
// main.ts
import 'virtual:uno.css';
```

#### 重置样式

```bash
pnpm add @unocss/reset
```

```css
// 基于tailwind 兼容按钮样式
import '@unocss/reset/tailwind-compat.css'
// or normalize
import '@unocss/reset/normalize.css'
```

#### 动态主题色 `antd `

```
pnpm add antd --save
```

```tsx
import { Button, ColorPicker, ConfigProvider, theme } from 'antd';
import type { MappingAlgorithm } from 'antd/es/config-provider/context';

function App() {
  const { token } = theme.useToken();
  const [color, setColor] = useState<string>(token.colorPrimary);
  // useState保存函数变量
  const [algorithm, setAlgorithm] = useState<MappingAlgorithm>(
    () => theme.defaultAlgorithm
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: color
        },
        algorithm: algorithm
      }}
    >
      <section>
        <h2>主题色:</h2>
        <ColorPicker
          value={color}
          onChange={(_, hex) => setColor(hex)}
        ></ColorPicker>
      </section>
      <section>
        <h2>颜色算法:</h2>
        <Button onClick={() => setAlgorithm(() => theme.defaultAlgorithm)}>
          默认算法
        </Button>
        <Button onClick={() => setAlgorithm(() => theme.darkAlgorithm)}>
          暗色算法
        </Button>
        <Button onClick={() => setAlgorithm(() => theme.compactAlgorithm)}>
          紧凑算法
        </Button>
      </section>
      <Button type="primary">按钮样式</Button>
    </ConfigProvider>
  );
}
```

## 代码校验规范

### [eslint](https://zh-hans.eslint.org/docs/latest/use/getting-started) 检测代码规范

[🔗 参考链接 1](https://juejin.cn/post/7071124270595702797)

[🔗 参考链接 2](https://juejin.cn/post/7118294114734440455#heading-6)

#### 基础使用

```bash
pnpm create @eslint/config
pnpm add -D @typescript-eslint/eslint-plugin eslint-plugin-react @typescript-eslint/parse
```

根据可交互的命令行，选择生成`.eslintrc.cjs`

```js
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react'],
  rules: {}
};
```

#### 处理[typescript](https://typescript-eslint.io/getting-started)

```bash
pnpm add --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
```

#### 处理 React

- 校验 hooks: `eslint-plugin-react-hooks`

```bash
pnpm add eslint-plugin-react-hooks -D
```

```json
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "extends": [
    // ...
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

#### 忽略文件

```bash
# .eslintignore
*.sh
node_modules
*.md
*.woff
*.ttf
.vscode
.idea
dist
/public
/docs
.husky
.local
/bin
.eslintrc.js
*.config.js
vite.config.ts
```

#### script 指令

```json
"lint:eslint": "eslint --fix --ext .js,.ts,.tsx ./src",
```

#### vscode 配置

```json
{
  // 开启自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll": false,
    "source.fixAll.eslint": true
  }
}
```

### [prettier](https://prettier.io/docs/en/index.html) 统一代码风格

#### 基础使用

```bash
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

#### 解决 eslint 冲突

- [eslint-plugin-prettier](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprettier%2Feslint-plugin-prettier)： 基于 prettier 代码风格的 eslint 规则，即 eslint 使用 pretter 规则来格式化代码
- [eslint-config-prettier](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprettier%2Feslint-config-prettier)： 禁用所有与格式相关的 eslint 规则，解决 prettier 与 eslint 规则冲突，**确保将其放在 extends 队列最后，覆盖其他配置**

```js
// .eslintrc.js
{
  plugins: [
     //...
  	"prettier"
  ],
  extends:[
    // 解决 eslint 和 prettier 的冲突 , 此项配置必须在最后
    "prettier",
	"plugin:prettier/recommended"
  ]
}
```

#### 配置规则

```js
// .prettierrc.cjs
module.exports = {
  // 是否换行的字符数量, 默认为80
  printWidth: 80,
  // tab代表空格数, 默认为2
  tabWidth: 2,
  // 是否使用tab进行缩进，默认为false
  useTabs: false,
  // 字符串是否使用单引号，默认为false
  singleQuote: true,
  // 行位是否使用分号，默认为true
  semi: false,
  // 是否使用尾逗号，有三个可选值"<none|es5|all>"
  trailingComma: 'none',
  // 对象大括号直接是否有空格，默认为true
  bracketSpacing: true
};
```

#### 忽略文件

```bash
#.prettierignore
/dist/*
.local
/node_modules/**
**/*.svg
**/*.sh
/public/*
```

#### script 指令

```json
"lint:prettier": "prettier --write --loglevel warn \"src/**/*.{js,ts,json,tsx,css,less,scss,html,md}\"",
```

#### vscode 配置

```json
{
  // 保存的时候自动格式化
  "editor.formatOnSave": true,
  // 默认格式化工具选择prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### [stylelint](https://stylelint.io/user-guide/get-started) 格式化 css 代码

[🔗 参考链接](https://juejin.cn/post/7118294114734440455)

#### 基础使用

```bash
npm init stylelint
npx stylelint "**/*.css"
```

将会安装 `stylelint stylelint-config-standard` 并创建 `.stylelintrc.cjs`

```js
module.exports = { extends: ['stylelint-config-standard'] };
```

```bash
pnpm add -D stylelint stylelint-config-standard postcss postcss-html stylelint-config-prettier stylelint-config-recess-order
# postcss 转换css代码工具
# stylelint-config-standard 标准共享配置规则
# postcss 转换css代码工具
# postcss-html 识别html/Vue中style标签的样式
# stylelint-config-prettier 关闭所有不必要或可能与Prettier冲突的规则
# stylelint-config-recess-order 以 Bootstrap 进行样式排序
```

#### 处理 Vue 文件

```bash
pnpm add -D stylelint-config-standard-vue
```

#### 处理 Scss

```bash
pnpm add -D postcss-scss stylelint-scss stylelint-config-recommended-scss
# postcss-scss 解析 SCSS 的自定义语法
# stylelint-scss 用于stylelint的scss规则集合插件
# stylelint-config-recommended-scss scss推荐可共享配置规则
```

#### 处理 Less

```bash
pnpm add -D postcss-less stylelint-less stylelint-config-recommended-less
# postcss-less 解析 less 的自定义语法
# stylelint-less 用于stylelint的less规则集合插件
# stylelint-config-recommended-less less推荐可共享配置规则
```

#### 配置文件

```js
module.exports = {
  // 共享配置
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-recommended-less',
    'stylelint-config-recess-order'
  ],

  // 拓展插件
  plugins: ['stylelint-less'],
  // 指定要应用配置的文件子集
  overrides: [
    {
      files: '**/*.scss',
      customSyntax: 'postcss-scss'
    },
    {
      files: ['**/*.(less|css)'],
      customSyntax: 'postcss-less'
    }
  ],
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    '**/*.json',
    '**/*.md',
    '**/*.yaml'
  ],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ]
  }
};
```

#### 忽略文件

```bash
# .stylelintignore
/dist/*
/public/*
public/*
```

#### script 指令

```json
"lint:stylelint": "stylelint --cache --fix \"**/*.{less,postcss,css,scss}\" --cache --cache-location node_modules/.cache/stylelint/",
```

#### vscode 配置

```json
// .vscode/settings.json
{
  // 开启自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll": false,
    "source.fixAll.eslint": true,
+   "source.fixAll.stylelint": true
  },
  // 保存的时候自动格式化
  "editor.formatOnSave": true,
  // 默认格式化工具选择prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  // 配置该项，新建文件时默认就是space：2
  "editor.tabSize": 2,{
  // 开启自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll": false,
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  // 保存的时候自动格式化
  "editor.formatOnSave": true,
  // 默认格式化工具选择prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  // 配置该项，新建文件时默认就是space：2
  "editor.tabSize": 2,
  // stylelint校验的文件格式
  "stylelint.validate": [
    "css",
    "less",
    "vue",
    "html"
  ]
}
```

## 规范提交信息

### 提交内容: husky

`husky`是用来管理 `git hook` 将在 `git` 提交代码的过程触发

```bash
pnpm add husky -D
```

添加`prepare`脚本命令

```json
"prepare": "husky install"
# 在 npm install 后自动执行该命令安装 husky 新增.husky 目录
```

使用`husky`命令添加`pre-commit`钩子

```bash
pnpm husky add .husky/pre-commit "pnpm lint:eslint && pnpm lint:prettier && pnpm lint:stylelint"
```

`.husky`目录下生成`pre-commit`文件

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint:eslint && pnpm lint:prettier && pnpm lint:stylelint
```

### 提交内容: lint-staged

使用 lint-staged 对暂存的代码进行规范校验和格式化

```bash
pnpm add lint-staged -D
```

```js
// .lintstagedrc.cjs
module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': [
    'prettier --write--parser json'
  ],
  'package.json': ['prettier --write'],
  '*.{scss,less,styl}': ['stylelint --fix', 'prettier --write'],
  '*.md': ['prettier --write']
};
```

更新 pre-commit

```bash
pnpm husky add .husky/pre-commit "pnpm lint-staged"
```

### 提交信息: commitlint

| **类型** | **描述**                                               |
| -------- | ------------------------------------------------------ |
| build    | 编译相关的修改，例如发布版本、对项目构建或者依赖的改动 |
| chore    | 其他修改, 比如改变构建流程、或者增加依赖库、工具等     |
| ci       | 持续集成修改                                           |
| docs     | 文档修改                                               |
| feat     | 新特性、新功能                                         |
| fix      | 修改 bug                                               |
| perf     | 优化相关，比如提升性能、体验                           |
| refactor | 代码重构                                               |
| revert   | 回滚到上一个版本                                       |
| style    | 代码格式修改, 注意不是 css 修改                        |
| test     | 测试用例修改                                           |

#### 基础使用

```bash
pnpm add commitlint @commitlint/config-conventional -D
```

添加配置文件

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional']
};
```

添加 commit-msg 钩子

```bash
pnpm husky add .husky/commit-msg 'pnpm --no-install commitlint --edit "$1"'
```

#### 使用 cz-git

```bash
# 管理员权限 可运行git cz
npm install -g commitizen
# 使用 cz 或 git cz 命令启动
pnpm add cz-git commitizen -D
```

- #### `package.json` 添加 `config` 指定使用的适配器

```json
{
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

#### 创建`commitlint.config.js`

- `cz-git` 与 `commitlint` 进行联动给予校验信息
- [详见](https://cz-git.qbb.sh/zh/config/#%E7%BA%AF%E6%B1%89%E5%8C%96%E6%A8%A1%E6%9D%BF)

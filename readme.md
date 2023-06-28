## 初始化项目

```
pnpm create vite app-name --template react-ts
pnpm dev
```

### 配置初始化

```
pnpm i @types/node -D
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

### 样式初始化

#### 动态主题色 `antd `

```
pnpm i antd --save
```

```tsx
import { Button, ColorPicker, ConfigProvider, theme } from 'antd'
import type { MappingAlgorithm } from 'antd/es/config-provider/context'

function App() {
  const { token } = theme.useToken()
  const [color, setColor] = useState<string>(token.colorPrimary)
  // useState保存函数变量
  const [algorithm, setAlgorithm] = useState<MappingAlgorithm>(
    () => theme.defaultAlgorithm
  )

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: color,
        },
        algorithm: algorithm,
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
  )
}
```

#### 使用 unocss

```
pnpm i -D unocss
```

```js
import UnoCSS from 'unocss/vite'
export default defineConfig({
  plugins: [UnoCSS()],
})
```

创建配置文件 `uno.config.ts`

```ts
import { defineConfig } from 'unocss'
export default defineConfig({
  // ...UnoCSS options
})
```

添加`virtual:uno.css`

```ts
// main.ts
import 'virtual:uno.css'
```

## 代码校验规范

### eslint 检测代码规范

```
pnpm i eslint -D
```

1. 初始化配置

```
pnpm create @eslint/config
```

将创建 `.eslintrc.cjs`文件并安装 ` @typescript-eslint/eslint-plugin@latest eslint-plugin-react@latest @typescript-eslint/parser@latest`

2. 创建`.eslintignore`文件

```
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

3. 校验 hooks: `eslint-plugin-react-hooks`

```
pnpm i eslint-plugin-react-hooks -D
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

1. 使用 airbnb 规则校验（可选）[详见](https://juejin.cn/post/7071124270595702797)

```bash
pnpm i eslint-config-airbnb eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-a11y -D
pnpm i eslint-config-airbnb-typescript -D
```

5. eslint 指令

```json
"lint:eslint": "eslint --fix --ext .js,.ts,.tsx ./src",
```

### prettier 统一代码风格

1. 初始化 prettier 配置

```bash
pnpm i prettier eslint-config-prettier eslint-plugin-prettier -D
```

- [eslint-plugin-prettier](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprettier%2Feslint-plugin-prettier)： 基于 prettier 代码风格的 eslint 规则，即 eslint 使用 pretter 规则来格式化代码
- [eslint-config-prettier](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprettier%2Feslint-config-prettier)： 禁用所有与格式相关的 eslint 规则，解决 prettier 与 eslint 规则冲突，**确保将其放在 extends 队列最后，覆盖其他配置**

2. 配置文件 `.prettierrc.cjs`

```js
module.exports = {
  semi: false,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'es5',
}
```

3. 忽略规则 `.prettierignore`

```
/dist/*
.local
/node_modules/**

**/*.svg
**/*.sh

/public/*
```

4. 解决冲突 `eslint-config-prettier`

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

5. prettier 指令

```json
"lint:prettier": "prettier --write --loglevel warn \"src/**/*.{js,ts,json,tsx,css,less,scss,html,md}\"",
```

### stylelint 格式化 css 代码

```bash
pnpm i stylelint stylelint-config-standard stylelint-config-prettier postcss-scss stylelint-scss stylelint-config-recess-order -D
```

- `stylelint-config-standard`: stylelint 标准可共享配置规则
- `stylelint-config-prettier`: 配置 stylelint 和 prettier 兼容
- `postcss-scss`: 识别 scss 语法
- `stylelint-scss`：用于 stylelint 的 scss 检测规则的集合
- `stylelint-config-recess-order`： 使用[Recess](https://github.com/twitter/recess/blob/29bccc870b7b4ccaa0a138e504caf608a6606b59/lib/lint/strict-property-order.js) 方式进行样式排序

[参考](https://juejin.cn/post/7118294114734440455)

#### 配置文件`.stylelintrc.js`

```js
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-prettier',
    'stylelint-config-prettier-scss',
    'stylelint-config-recess-order',
  ],
  plugins: ['stylelint-scss'],
  overrides: [
    {
      files: '**/*.scss',
      customSyntax: 'postcss-scss',
    },
  ],
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    '**/*.json',
    '**/*.md',
    '**/*.yaml',
  ],
  rules: {},
}
```

#### 忽略规则 .stylelintignore

```
/dist/*
/public/*
public/*
```

#### stylelint 指令

```json
"lint:stylelint": "stylelint --cache --fix \"**/*.{less,postcss,css,scss}\" --cache --cache-location node_modules/.cache/stylelint/",
```

## 规范提交信息

### 提交内容 `husky` `lint-staged`

`husky`是用来管理 `git hook` 将在 `git` 提交代码的过程触发

```bash
pnpm i husky -D
```

#### 脚本命令

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

- 将在 `npm install`后自动执行该命令安装`husky`，新增`.husky`目录

#### `pre-commit`钩子

```bash
yarn husky add .husky/pre-commit "yarn lint:eslint && yarn lint:prettier && yarn lint:stylelint"
pnpm husky add .husky/pre-commit "pnpm lint:eslint && pnpm lint:prettier && pnpm lint:stylelint"
```

#### 创建`lint-staged.config.cjs`

- 本地暂存代码检查工具 `lint-staged`

```bash
pnpm i lint-staged -D
#更新pre-commit
npx husky add .husky/pre-commit "npx lint-staged"
```

### 提交信息 `commitlint` `commitizen` `cz-git`

```bash
pnpm i commitlint -D
```

#### 使用`cz-git`

```bash
# 管理员权限 可运行git cz
npm install -g commitizen
# 使用 cz 或 git cz 命令启动
pnpm i cz-git commitizen -D
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

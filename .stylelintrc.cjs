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

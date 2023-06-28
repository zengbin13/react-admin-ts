module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    // 'stylelint-config-recommended-less',
    'stylelint-config-recess-order',
  ],
  plugins: ['stylelint-order'],
  // 不同格式的文件指定自定义语法
  overrides: [
    {
      files: ['**/*.(less|css|html)'],
      customSyntax: 'postcss-less',
    },
    {
      files: ['**/*.(html)'],
      customSyntax: 'postcss-html',
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

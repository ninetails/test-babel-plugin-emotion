const util = require('util')
const { lstatSync, readdirSync, realpathSync } = require('fs')
const { join } = require('path')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory)

const changeBabelLoader = () => ({
  loader: 'babel-loader',
  options: {
    presets: [
      ["@babel/preset-env", { useBuiltIns: "entry" }],
      "@babel/preset-react",
      "@babel/preset-flow"
    ],
    plugins: [
      "emotion"
    ]
  }
})

const filterBabel = transform => use => use.loader === 'babel-loader' ? transform(use) : use

const changeJs = rule => ({
  ...rule,
  use: rule.use.map(filterBabel(changeBabelLoader)),
  include: getDirectories(realpathSync(join(__dirname, '../..'))),
  exclude: [/node_modules/]
})

const filterIfJs = transform => rule => rule.test.test('.js') ? transform(rule) : rule

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
  const config = {
    ...storybookBaseConfig,
    module: {
      ...storybookBaseConfig.module,
      rules: storybookBaseConfig.module.rules.map(filterIfJs(changeJs))
    },
    plugins: storybookBaseConfig.plugins.filter(plugin => plugin !== storybookBaseConfig.plugins[4]),
    resolve: {
      ...storybookBaseConfig.resolve,
      modules: [
        realpathSync(join(__dirname, '../../../node_modules')),
        'node_modules'
      ]
    }
  }
  console.log(util.inspect(config, false, null, true))

  return config
}

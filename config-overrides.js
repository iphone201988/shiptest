const { override, fixBabelImports, addLessLoader, addWebpackPlugin, addWebpackAlias} = require('customize-cra');
const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
  }),
  addWebpackPlugin(new MomentLocalesPlugin( { localesToKeep: ['ca'] })),
  addWebpackPlugin(new BundleAnalyzerPlugin()),
  addWebpackAlias({
    ['components']: path.resolve(__dirname, './src/components'),
    ['containers']: path.resolve(__dirname, './src/containers'),
    ['constants']: path.resolve(__dirname, './src/constants'),
    ['helpers']: path.resolve(__dirname, './src/helpers'),
    ['images']: path.resolve(__dirname, './src/images'),
    ['model']: path.resolve(__dirname, './src/model'),
    ['settings']: path.resolve(__dirname, './src/settings'),
    ['languageProvider']: path.resolve(__dirname, './src/languageProvider'),
  })
);
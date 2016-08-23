export default { // 项目下直接命令 rollup -c
  entry: 'src/index.js',
  format: 'umd', // cjs amd es6 umd iife
  dest: './bundle.js', // 输出文件
  moduleName: 'Date', // umd 或 iife 模式下，若入口文件含 export，必须加上该属性
  sourceMap: false   // 调试编译
}
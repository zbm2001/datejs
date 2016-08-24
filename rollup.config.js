import buble from 'rollup-plugin-buble';

var external = Object.keys( require( './package.json' ).devDependencies );

export default { // 项目下直接命令 rollup -c
  entry: 'src/index.js',
  //plugins: [ buble() ],
  external: external,
  targets: [
   { plugins: [ buble() ], dest: 'bundle.cjs.js', format: 'cjs' },
   { plugins: [ buble() ], dest: 'bundle.es.js', format: 'es' },
   { plugins: [ buble() ], dest: 'bundle.umd.js', format: 'umd', moduleName: 'Date' }
  ],
  // format: 'umd', // cjs amd es6 umd iife
  // dest: 'bundle.js', // 输出文件
  // moduleName: 'Date', // umd 或 iife 模式下，若入口文件含 export，必须加上该属性
  sourceMap: false   // 调试编译
}
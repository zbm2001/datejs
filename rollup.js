// 项目下直接命令 node rollup.js
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');

rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: ["es2015-rollup"]
    }),
    uglify()
  ]
}).then(bundle => {
  bundle.write({
    // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
    format: 'umd', // cjs amd es6 umd iife
    dest: 'bundle.js',
    moduleName: 'Date', // umd 或 iife 模式下，若入口文件含 export，必须加上该属性
    sourceMap: false,
    banner: ('a')
  });
}).
catch(e => {
  process.stderr.write(e.message + '\n');
process.exit(1);
})
;
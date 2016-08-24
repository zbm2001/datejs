// 项目下直接命令 node rollup.js
// import fs from 'fs';
// import rollup from 'rollup';
// import babel from 'rollup-plugin-babel';
// import uglify from 'rollup-plugin-uglify';

const fs = require('fs');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');

rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    babel({
      //runtimeHelpers: true,
      exclude: 'node_modules/**',
      //presets: ["es2015-rollup"],
      babelrc: true
    })//,
    //uglify()
  ]
}).then(bundle => {
  bundle.write({
    // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
    format: 'umd', // cjs amd es6 umd iife
    dest: 'bundle.umd.js',
    moduleName: 'Date', // umd 或 iife 模式下，若入口文件含 export，必须加上该属性
    sourceMap: false,
    banner: (
      '/*!\n' +
      String(fs.readFileSync('./LICENSE')).trim().split('\n').map(l => ` * ${l}`).join('\n') +
      '\n */'
    )
  });
}).catch(e => {
  process.stderr.write(e.message + '\n');
  process.exit(1);
});
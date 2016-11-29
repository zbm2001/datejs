import fs from 'fs';

export default function getDirModules(path) {
  var files = fs.readdirSync(path);
  var modules = files.map((file) => require(path.join(path, file)));
  return modules;
};
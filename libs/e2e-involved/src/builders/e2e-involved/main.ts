import { allFilesInDir } from './ast-utils';
const components = allFilesInDir('./app', 'component');
console.log(components);


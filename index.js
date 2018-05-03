const path = require("path");

const sortPaths = require("sort-paths");
const orderedObject = require("ordered-object");
const fse = require("fs-extra");
const {analyze} = require("es-info");
const {createFilter} = require("rollup-pluginutils");

const DEFAULT = {
  import: true,
  export: true,
  dynamicImport: true,
  strip: false
};

function factory(options = {}) {
  options = Object.assign({}, DEFAULT, options);
  const filter = createFilter(options.include, options.exclude);
  const infoTable = {};
  
  return {
    name: "rollup-plugin-es-info",
    transform(code, id) {
      if (!filter(id)) {
        return;
      }
      const ast = this.parse(code);
      const result = analyze(ast, {dynamicImport: true});
      
      if (options.strip) {
        code = [
          ...Object.keys(result.import).map(i => `import ${JSON.stringify(i)};`),
          ...result.dynamicImport.map(i => `import(${JSON.stringify(i)});`)
        ].join("\n");
      }
        
      if (!options.import) {
        delete result.import;
      }
      if (!options.export) {
        delete result.export;
      }
      if (!options.dynamicImport) {
        delete result.dynamicImport;
      }
      
      const newId = path.relative(process.cwd(), id);
      infoTable[newId] = result;
      
      if (options.strip) {
        return {code};
      }
    },
    ongenerate() {
      if (options.file) {
        // sort object
        const table = orderedObject.create(
          infoTable,
          sortPaths(Object.keys(infoTable), path.sep)
        );
        for (const info of Object.values(table)) {
          info.import = orderedObject.create(
            info.import,
            sortPaths(Object.keys(info.import), path.sep)
          );
        }
        fse.outputJsonSync(options.file, table, {
          spaces: 2
        });
      }
      if (options.ongenerate) {
        options.ongenerate(infoTable);
      }
    }
  };
}

module.exports = factory;

const fse = require("fs-extra");
const {analyze} = require("es-info");
const {createFilter} = require("rollup-pluginutils");

const DEFAULT = {
  import: true,
  export: true,
  dynamicImport: true
};

function factory(options = {}) {
  if (!options.file && !options.ongenerate) {
    throw new Error("must define `options.file` or `options.ongenerate`");
  }
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
      
      let newCode = Object.keys(result.import).map(i => `import ${JSON.stringify(i)};`).join("\n") +
        "\n" +
        result.dynamicImport.map(i => `import(${JSON.stringify(i)});`).join("\n");
        
      if (!options.import) {
        delete result.import;
      }
      if (!options.export) {
        delete result.export;
      }
      if (!options.dynamicImport) {
        delete result.dynamicImport;
      }
      
      infoTable[id] = result;
      
      return {code: newCode};
    },
    ongenerate() {
      if (options.file) {
        fse.outputJsonSync(options.file, infoTable, {spaces: 2});
      } else {
        options.ongenerate(infoTable);
      }
    }
  };
}

module.exports = factory;

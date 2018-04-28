rollup-plugin-es-info
=====================

Dump import/export information of each module. Note that when this plugin is activated, it strips all export statements and empties your bundle. The information is extracted by [es-info](https://github.com/eight04/es-info).

Installation
------------

```
npm install -D rollup-plugin-es-info
```

Usage
-----

```js
import esInfo from "rollup-plugin-es-info"

export default {
  input: ["entry.js"],
  output: {
    dir: "dist",
    format: "cjs"
  },
  plugins: [
    esInfo({
      include: ["**/*.js"],
      file: "es-info.json",
      import: false,
      export: true,
      dynamicImport: false
    })
  ]
};
```

API reference
-------------

This module exports a single function.

### esInfoPluginFactory(options): RollupPlugin object

`options` has following properties:

* `include?`: `Array<string>`. A list of minimatch pattern. Only matched files are processed. If undefined then match all files.
* `exclude?`: `Array<string>`. A list of minimatch pattern. Matched files are excluded.
* `file?`: `string`. The output filename.
* `ongenerate?`: `function`. When the bundle is generated this function is called with an object map. Each key is the module ID and the value is the information about the module.
* `import?`: `boolean`. If false then strip `import` information. Default: `true`.
* `export?`: `boolean`. If false then strip `export` information. Default: `true`.
* `dynamicImport?`: `boolean`. If false then strip `dynamicImport` information. Default: `true`.

You must define `options.file` or `options.ongenerate`.

Changelog
---------

* 0.1.0 (Apr 29, 2018)

  - Initial releast.

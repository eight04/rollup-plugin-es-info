rollup-plugin-es-info
=====================

Dump import/export information of each module. The information is extracted by [es-info](https://github.com/eight04/es-info).

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
      include: ["**/*"],
      file: "es-info.json",
      import: false,
      dynamicImport: false,
      strip: true
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
* `ongenerate?`: `function`. When the bundle is generated, this function is called with an object map. Each key is the module path relative to cwd and the value is the information about the module.
* `import?`: `boolean`. If true then save `import` information. Default: `true`.
* `export?`: `boolean`. If true then save `export` information. Default: `true`.
* `dynamicImport?`: `boolean`. If true then save `dynamicImport` information. Default: `true`.
* `strip?`: `boolean`. If true then strip all the codes and leave only `import`/`export` statements, resulting a faster build. Turn this on if you don't need the actual bundle e.g. you are just linting the code/verifying the dependency tree. Default: `false`.

Changelog
---------

* 0.1.0 (Apr 29, 2018)

  - Initial releast.

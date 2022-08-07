rollup-plugin-es-info
=====================

[![Build Status](https://travis-ci.org/eight04/rollup-plugin-es-info.svg?branch=master)](https://travis-ci.org/eight04/rollup-plugin-es-info)
[![Coverage Status](https://coveralls.io/repos/github/eight04/rollup-plugin-es-info/badge.svg?branch=master)](https://coveralls.io/github/eight04/rollup-plugin-es-info?branch=master)

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
* `file?`: `string`. A filename. If set then output the information table to the file.
* `ongenerate?`: `function`. When the bundle is generated, this function is called with an object map. Each key is the module path relative to cwd and the value is the information about the module.
* `import?`: `boolean`. If true then save `import` information. Default: `true`.
* `export?`: `boolean`. If true then save `export` information. Default: `true`.
* `dynamicImport?`: `boolean`. If true then save `dynamicImport` information. Default: `true`.
* `strip?`: `boolean`. If true then strip all the codes and leave only `import` statements, resulting a faster build. Turn this on if you don't need the actual bundle e.g. you are just linting the code/verifying the dependency tree. Default: `false`.

Changelog
---------

* 0.3.0 (Aug 8, 2022)

  - Bump dependencies. Update rollup to 2.77.2.

* 0.2.0 (Jun 5, 2019)

  - Bump dependencies. Update rollup to 1.13.1.

* 0.1.3 (May 3, 2018)

  - Change: keep the key order of imports.

* 0.1.2 (May 3, 2018)

  - Change: keep the key order of output JSON. use `sort-paths`.

* 0.1.1 (May 3, 2018)

  - Fix: gencode problem for dynamic imports.

* 0.1.0 (May 2, 2018)

  - Initial releast.

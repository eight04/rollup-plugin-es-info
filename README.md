rollup-plugin-es-info
=====================

Dump import/export information of each module. Note that when this plugin is activated, it strips all export statements and empties your bundle.

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

Changelog
---------

* 0.1.0 (?)

  - Initial releast.

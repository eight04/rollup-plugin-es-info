/* eslint-env mocha */
const assert = require("assert");
const path = require("path");

const rollup = require("rollup");

const esInfo = require("..");

function bundle(file, options) {
  const codes = [];
  const generated = deferred();
  options = Object.assign({
    ongenerate(info) {
      generated.resolve(info);
    }
  }, options);
  return rollup.rollup({
    input: [resolveFile(file)],
    plugins: [
      esInfo(options),
      {
        transform(code) {
          codes.push(code);
        }
      }
    ]
  })
    .then(bundle => bundle.generate({
      format: "cjs",
      legacy: true,
      freeze: false,
      sourcemap: true
    }))
    .then(result => {
      return {result, codes, generated};
    });
}

function test(file, expect) {
  const newExpect = {};
  for (const key of Object.keys(expect)) {
    const newKey = resolveFile(key);
    newExpect[newKey] = expect[key];
  }
  expect = newExpect;
  return bundle(file)
    .then(({generated}) => generated)
    .then(info => {
      assert.deepStrictEqual(info, expect);
    });
}

function deferred() {
  let resolve, reject;
  const q = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  q.resolve = resolve;
  q.reject = reject;
  return q;
}

function resolveFile(file) {
  return path.relative(process.cwd(), path.resolve(`${__dirname}/fixtures/${file}`));
}

describe("main", () => {
  it("simple sample", () => 
    test("entry.js", {
      "entry.js": {
        import: {
          "./foo": {
            default: false,
            all: false,
            named: ["foo"]
          }
        },
        export: {
          default: true,
          all: false,
          named: []
        },
        dynamicImport: ["./bar"]
      },
      "foo.js": {
        import: {},
        export: {
          default: false,
          named: ["foo"],
          all: false
        },
        dynamicImport: []
      },
      "bar.js": {
        import: {},
        export: {
          default: true,
          named: [],
          all: false
        },
        dynamicImport: []
      }
    })
  );
  
  it("dynamicImport + strip", () => 
    bundle("entry.js", {strip: true})
      .then(({codes: [code]}) => {
        assert.equal(code, `import "./foo";
import("./bar");`);
      })
  );
});

/* eslint-env mocha */
const assert = require("assert");
const path = require("path");

const rollup = require("rollup");

const esInfo = require("..");

function test(file, expect) {
  const newExpect = {};
  for (const key of Object.keys(expect)) {
    const newKey = resolveFile(key);
    newExpect[newKey] = expect[key];
  }
  expect = newExpect;
  const generated = {};
  generated.promise = new Promise((resolve, reject) => {
    generated.resolve = resolve;
    generated.reject = reject;
  });
  return rollup.rollup({
    input: [resolveFile(file)],
    plugins: [
      esInfo({
        ongenerate(info) {
          generated.resolve(info);
        }
      })
    ],
    experimentalCodeSplitting: true,
    experimentalDynamicImport: true
  })
    .then(bundle => bundle.generate({
      format: "cjs",
      legacy: true,
      freeze: false,
      sourcemap: true
    }))
    .then(() => generated.promise)
    .then(info => {
      assert.deepStrictEqual(info, expect);
    });
}

function resolveFile(file) {
  return path.resolve(`${__dirname}/fixtures/${file}`);
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
        dynamicImport: []
      },
      "foo.js": {
        import: {},
        export: {
          default: false,
          named: ["foo"],
          all: false
        },
        dynamicImport: []
      }
    })
  );
});

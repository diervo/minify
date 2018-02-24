jest.autoMockOff();

const mocks = [
  "babel7-plugin-minify-builtins",
  "babel7-plugin-minify-constant-folding",
  "babel7-plugin-minify-dead-code-elimination",
  "babel7-plugin-minify-flip-comparisons",
  "babel7-plugin-minify-guarded-expressions",
  "babel7-plugin-minify-infinity",
  "babel7-plugin-minify-mangle-names",
  "babel7-plugin-minify-numeric-literals",
  "babel7-plugin-minify-replace",
  "babel7-plugin-minify-simplify",
  "babel7-plugin-minify-type-constructors",
  "babel7-plugin-transform-inline-consecutive-adds",
  "babel7-plugin-transform-member-expression-literals",
  "babel7-plugin-transform-merge-sibling-variables",
  "babel7-plugin-transform-minify-booleans",
  "babel7-plugin-transform-property-literals",
  "babel7-plugin-transform-regexp-constructors",
  "babel7-plugin-transform-remove-console",
  "babel7-plugin-transform-remove-debugger",
  "babel7-plugin-transform-remove-undefined",
  "babel7-plugin-transform-simplify-comparison-operators",
  "babel7-plugin-transform-undefined-to-void"
];

mocks.forEach(mockName => {
  // it's called mockName for jest(babel-jest-plugin) workaround
  jest.mock(mockName, () => mockName);
});

const preset = require("../src/index");

function getPlugins(opts) {
  return preset({}, opts).presets[0].plugins;
}

function testOpts(opts) {
  expect({
    input: opts,
    output: getPlugins(opts)
  }).toMatchSnapshot();
}

describe("preset-options", () => {
  it("should be a function", () => {
    expect(typeof preset).toBe("function");
  });

  it("should return defaults with no options", () => {
    expect(getPlugins()).toMatchSnapshot();
    expect(getPlugins({})).toMatchSnapshot();
    expect(getPlugins(null)).toMatchSnapshot();
  });

  it("should handle simple options", () => {
    testOpts({
      mangle: false,
      deadcode: false
    });
  });

  it("should pass options to respective plugin when its an object", () => {
    testOpts({
      mangle: {
        exclude: ["foo", "bar"]
      }
    });
  });

  it("should handle options that are delegated to multiple other options", () => {
    testOpts({
      keepFnName: false,
      keepClassName: false
    });
    testOpts({
      keepFnName: true,
      keepClassName: true,
      mangle: {
        exclude: ["foo", "bar"]
      }
    });
    testOpts({
      keepFnName: true,
      keepClassName: true,
      mangle: {
        exclude: ["baz"],
        keepFnName: false,
        keepClassName: false
      }
    });
  });
});

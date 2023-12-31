<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@csstools/postcss-tape](./postcss-tape.md) &gt; [TestCaseOptions](./postcss-tape.testcaseoptions.md)

## TestCaseOptions interface

Options for a test case.

**Signature:**

```typescript
export interface TestCaseOptions 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [after?](./postcss-tape.testcaseoptions.after.md) |  | () =&gt; void \| Promise&lt;void&gt; | _(Optional)_ Do something after the test is run. |
|  [before?](./postcss-tape.testcaseoptions.before.md) |  | () =&gt; void \| Promise&lt;void&gt; | _(Optional)_ Do something before the test is run. |
|  [exception?](./postcss-tape.testcaseoptions.exception.md) |  | RegExp | _(Optional)_ Expected exception |
|  [expect?](./postcss-tape.testcaseoptions.expect.md) |  | string | _(Optional)_ Override the file name of the "expect" file. |
|  [message?](./postcss-tape.testcaseoptions.message.md) |  | string | _(Optional)_ Debug message |
|  [options?](./postcss-tape.testcaseoptions.options.md) |  | unknown | _(Optional)_ Plugin options. Only used if <code>plugins</code> is not specified. |
|  [plugins?](./postcss-tape.testcaseoptions.plugins.md) |  | Array&lt;Plugin&gt; | _(Optional)_ Plugins to use. When specified the original plugin is not used. |
|  [result?](./postcss-tape.testcaseoptions.result.md) |  | string | _(Optional)_ Override the file name of the "result" file. |
|  [source?](./postcss-tape.testcaseoptions.source.md) |  | string | _(Optional)_ Override the file name of the "source" file. |
|  [warnings?](./postcss-tape.testcaseoptions.warnings.md) |  | number | _(Optional)_ The expected number of warnings. |

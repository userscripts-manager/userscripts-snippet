# userscripts-snippet

A collection of code snippets for userscripts.

Those snippets can be used with **userscripts-manager** to quickly create new userscripts, as they use the `@import{}` mechanism used in **userscripts-manager**.

To use this collection of snippets in your userscripts using **userscripts-manager**, you can add this repo as submodule, and then create a userscripts.rc file in your home directory with the following content:

```json
{
  "snippets": [
    "snippet",
    "userscripts-snippet/base"
  ]
}
```

All the snippets from the "snippet" folder (your personnnal snippets) and the "userscripts-snippet/base" folder (the snippets from this repo) will then be available in your userscripts when you use the `@import{}` mechanism.


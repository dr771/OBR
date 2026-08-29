## 1. Price renderer

- [x] 1.1 Remove whole-euro modulo and `,00` to `,-` replacement logic from `snippets/price.liquid`.
- [x] 1.2 Rewrite the explanatory Liquid comment to document symbol-only, two-decimal output.

## 2. Verification and delivery

- [x] 2.1 Validate the theme and OpenSpec change.
- [x] 2.2 Push only `snippets/price.liquid` to active theme `148245381229`.
- [x] 2.3 Verify live `€25,00` and `€7,99` output, absence of trailing `EUR`, and continued header/footer presence.
- [x] 2.4 Archive the completed OpenSpec change and commit/push the implementation plus shared documentation.

# @mojis/moji-compare

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Compare Emoji & Unicode versions

> [!NOTE]
> This is based on code from [`omichelsen/compare-versions`](https://github.com/omichelsen/compare-versions), but changed to work better with emoji and unicode versions.

## 📦 Installation

```bash
npm install @mojis/moji-compare
```

## Usage

```ts
import { compare } from "@mojis/moji-compare";

compare("10.1.8", "10.0.4", ">"); // true
compare("10.0.1", "10.0.1", "="); // true
compare("10.1.1", "10.2.2", "<"); // true
compare("10.1.1", "10.2.2", "<="); // true
compare("10.1.1", "10.2.2", ">="); // false
```

## 📄 License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@mojis/moji-compare?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/@mojis/moji-compare
[npm-downloads-src]: https://img.shields.io/npm/dm/@mojis/moji-compare?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/@mojis/moji-compare

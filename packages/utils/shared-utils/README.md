# @sheet-i18n/shared-utils

A collection of commonly used pure functions for the `sheet-i18n` ecosystem. This package provides utility functions that can be reused across different projects.

## Installation

To install this package, use your preferred package manager:

```bash
npm install @sheet-i18n/shared-utils
# or
yarn add @sheet-i18n/shared-utils
# or
pnpm add @sheet-i18n/shared-utils
```

## Usage

This package provides various utility functions. Below is an example of how to use it:

```typescript
import { isNullish } from '@sheet-i18n/shared-utils';

const target = null;

if (isNullish(target)) {
  console.log('target is nullish');
}
```

## Features

- Reusable pure functions.
- Lightweight and efficient.
- Integrates seamlessly with other `@sheet-i18n` packages.

## Scripts

- **build**: Builds the library using `tsup`.
- **dev**: Watches for changes and rebuilds during development.
- **publish:npm**: Publishes the package to npm.

## Files Included

This package includes the following files in the `dist` folder after building:

- **index.js**: CommonJS entry point.
- **index.mjs**: ES Module entry point.
- **index.d.ts**: TypeScript declaration file.

## Exports

The package provides the following exports:

- **CommonJS**: `./dist/index.js`
- **ES Module**: `./dist/index.mjs`

## Development Dependencies

- **@sheet-i18n/typescript-config**: Shared TypeScript configuration presets.

## Author

**devAnderson**  
[GitHub Profile](https://github.com/chltjdrhd777)  
[Email](mailto:chltjdrhd777@gmail.com)

## License

This project is licensed under the [ISC License](LICENSE).

## Contributing

Contributions are welcome! If you have suggestions or find bugs, feel free to open an issue or a pull request on the [GitHub repository](https://github.com/chltjdrhd777).

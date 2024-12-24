# @sheet-i18n/errors

A custom error-handling library for the `sheet-i18n` ecosystem. This package provides reusable error classes and utilities to streamline exception handling in your projects.

## Installation

To install this package, use your preferred package manager:

```bash
npm install @sheet-i18n/errors
# or
yarn add @sheet-i18n/errors
# or
pnpm add @sheet-i18n/errors
```

## Usage

This package provides custom error classes and utilities to standardize error handling. Below is an example of how to use it:

```typescript
import { CustomError } from '@sheet-i18n/errors';

class MyCustomError extends CustomError {
  constructor(message: string) {
    super(message, 'MyCustomError');
  }
}

try {
  throw new MyCustomError('Something went wrong!');
} catch (error) {
  if (error instanceof CustomError) {
    console.error(`[${error.name}]: ${error.message}`);
  }
}
```

## Features

- Standardized error handling.
- Customizable error classes.
- Integration with other `@sheet-i18n` packages.

## Scripts

- **build**: Builds the library using `tsup`.
- **dev**: Watches for changes and rebuilds during development.

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

## Keywords

- `sheet-i18n`
- `utils`
- `errors`

## Author

**devAnderson**  
[GitHub Profile](https://github.com/chltjdrhd777)  
[Email](mailto:chltjdrhd777@gmail.com)

## License

This project is licensed under the [ISC License](LICENSE).

## Contributing

Contributions are welcome! If you have suggestions or find bugs, feel free to open an issue or a pull request on the [GitHub repository](https://github.com/chltjdrhd777).

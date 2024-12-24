# @sheet-i18n/typescript-config

A collection of reusable TypeScript configuration presets for various environments, including base, Node.js, and React projects.

## Installation

To install this package, use your preferred package manager:

```bash
npm install @sheet-i18n/typescript-config --save-dev
# or
yarn add @sheet-i18n/typescript-config --dev
# or
pnpm add @sheet-i18n/typescript-config --save-dev
```

## Usage

You can extend the configurations provided in this package in your `tsconfig.json` file:

### Base Configuration

```json
{
  "extends": "@sheet-i18n/typescript-config/base.json"
}
```

### Node.js Configuration

```json
{
  "extends": "@sheet-i18n/typescript-config/node.json"
}
```

### React Configuration

```json
{
  "extends": "@sheet-i18n/typescript-config/react.json"
}
```

## Files Included

This package includes the following configuration files:

- **base.json**: A base TypeScript configuration suitable for most projects.
- **node.json**: A TypeScript configuration tailored for Node.js projects.
- **react.json**: A TypeScript configuration optimized for React projects.

## Author

**devAnderson**  
[GitHub Profile](https://github.com/chltjdrhd777)  
[Email](mailto:chltjdrhd777@gmail.com)

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! If you have suggestions or find bugs, feel free to open an issue or a pull request on the [GitHub repository](https://github.com/chltjdrhd777).

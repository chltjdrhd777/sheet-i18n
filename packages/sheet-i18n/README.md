# sheet-i18n

**An all-in-one package for sheet-based translations.**

[![npm](https://img.shields.io/npm/v/sheet-i18n)](https://www.npmjs.com/package/sheet-i18n)  
<a href="https://sheet-i18n.vercel.app/en" target="_blank">

<!-- <img height="20px" src="https://img.shields.io/badge/📚-%20Docs-%23000000"/> -->
</a>

## Installation 🛠️

You can install **sheet-i18n** via npm:

```bash
npm install sheet-i18n
```

## Usage 🚀

### 📑 Main Package - `sheet-i18n`

This is the core package for sheet-based translations. You can use it to work with Google Sheets and export translations.

<details>
  <summary>📄 Server export function - sheet-i18n/exporter</summary>

#### `sheet-i18n/exporter`

The **server-side exporter** subpackage allows you to interact with Google Sheets and export translations directly into your project. This is primarily used in server-side environments, such as Next.js API routes or other backend frameworks, where you want to fetch and store translations from a Google Spreadsheet to be served to clients or used within your server application.

```jsx
import { googleSheetExporter } from 'sheet-i18n/exporter';

const exporter = await googleSheetExporter({
  credentials: {
    sheetId: 'your-google-sheet-id',
    clientEmail: 'your-client-email',
    privateKey: 'your-private-key',
  },
  defaultLocale: 'default-language-in-sheet-header',
});

await exporter.exportTranslations();
```

### Configuration ⚙️

The configuration object required for using the exporter is as follows:

#### Required 📝

- **`credentials`**: Google Sheets API credentials:
  - `sheetId`: The ID of your Google Spreadsheet (extracted from the URL).
  - `clientEmail`: The email of the Google Sheets API client.
  - `privateKey`: The private key associated with the client.
- **`defaultLocale`**: The default locale/language specified in your Google Sheet header.

#### Optional 🔧

- **`headerStartRowNumber`**: Specifies the row number where the headers begin (if not at the top).
- **`ignoredSheets`**: A list of sheets to exclude by title. By default, sheets without the `defaultLocale` in headers will be ignored.
- **`exportPath`**: Path to save exported translations. This is the location where the exported translations will be saved. By default, it will use the current working directory (cwd). This option is only used when calling the `exportTranslations` method.

### Exporter Methods 🛠️

#### `getTranslations` 📝

- **Description**: This function retrieves the translation data, which is structured by locale keys (such as "ko", "en", etc.). It collects all translations from the specified sheet, replaces any placeholders, and prepares them to be sent to the client in the response body. Each key corresponds to a language, and the value for each key is an object containing the translated text for that locale.

- **Type**: Function
- **Parameters**: None
- **Returns**: An object where each key is a locale (e.g., "ko", "en"), and the value is the respective translation data for that locale.

#### Example:

If the headers in your Google Sheets are `["ko", "en", ...]`, the result returned by `getTranslations` will look like this:

```ts
{
  "ko": {
    "greeting": "안녕하세요",
    "farewell": "안녕히 가세요"
  },
  "en": {
    "greeting": "Hello",
    "farewell": "Goodbye"
  }

  ...
}
```

In this example:

- `"ko"` contains the translations for Korean.
- `"en"` contains the translations for English.
  Each locale’s object contains key-value pairs for individual translations.

#### `exportTranslations` 📤

- **Description**: This asynchronous function is used in a Node.js environment to export translations directly into your project. It is especially useful if your project includes server-side APIs (like Next.js API routes) and you need to update the locale JSON data in your project. It can be invoked to update or create the locale files within your project, ensuring that the translation data is synced with the local environment.

- **Type**: Function
- **Parameters**: None
- **Returns**: `void`

#### Example:

If you call the `exportTranslations` function, it will update or create JSON files in your project for each locale. The result could look like this:

```ts
// ko.json
{
  "greeting": "안녕하세요",
  "farewell": "안녕히 가세요"
}

// en.json
{
  "greeting": "Hello",
  "farewell": "Goodbye"
}
```

### API Documentation 📚

This package provides a streamlined way to export data using sheets API. It is designed to simplify the integration of spreadsheet data into your applications, particularly for translation workflows and internationalization (i18n).

[Google Sheets API Documentation](https://developers.google.com/sheets/api)<br>
[Google Auth Library](https://www.npmjs.com/package/google-auth-library)<br>
[Google Spreadsheet](https://www.npmjs.com/package/google-spreadsheet)

### Exporting Data Format 🗂️

The exported translations will be saved in a format that is easy to use for localization purposes. Each translation is stored in its respective locale folder, with a structured format.

</details>

---

<details>
  <summary>📄 Client export function - sheet-i18n/react</summary>

#### `sheet-i18n/react`

The **client-side i18n library** subpackage.

This package provides tools to handle translations in React applications using context and hooks. It simplifies internationalization workflows by offering functions and components to manage, access, and use locale-specific translation data.

## ✨ Package Introduction

- **createI18nStore**: `Store Creation` for managing translation data.
- **createI18nContext**: `React Context` to generate providers and hooks for translations.
- **IntlProvider**: `Translation Provider` for managing current locale.
- **useTranslation**: `Translation Hook` for easy access to translation messages.

## 🚀 Getting Started

### Package list

```bash
import { createI18nStore, createI18nContext, useTranslation } from '@sheet-i18n/react';
```

### Basic Usage

#### 1. Define Translation Data

Prepare locale JSON files:

```json
// en.json
{
  "header": {
    "login": "Login",
    "logout": "Logout"
  }
}

// ko.json
{
  "header": {
    "login": "로그인",
    "logout": "로그아웃"
  }
}
```

#### 2. Create i18n Store

this store will be used as a core translations module.

```tsx
import en from './en.json';
import ko from './ko.json';

import { createI18nStore } from '@sheet-i18n/react';

export const i18nStore = createI18nStore({
  supportedLocales: ['ko', 'en'],
  defaultLocale: 'ko',
  localeSet: {
    ko,
    en,
  },
});
```

#### 3. Create i18n Context

```tsx
import { i18nStore } from './file-path-of-i18nStore-initiated';
import { createI18nContext } from '@sheet-i18n/react';

export const { IntlProvider, useTranslation } = createI18nContext(i18nStore);
```

#### 4. Mount Intl Context Provider in your App

```tsx
import React from 'react';
import { IntlProvider } from './i18nContext';

const App = (currentLocale: string) => {
  return (
    <IntlProvider currentLocale={currentLocale}>
      <YourComponent />
    </IntlProvider>
  );
};
```

#### 5. Use Translations

```tsx
import React from 'react';
import { useTranslation } from './i18nContext';

const YourComponent = () => {
  const { t } = useTranslation('header');

  return (
    <div>
      <button>{t('login')}</button>
      <button>{t('logout')}</button>
    </div>
  );
};
```

---

## 📦 API Reference

### `createI18nStore`

Creates a store for managing translations.

#### Parameters:

- **`supportedLocales`** (array): Array of supported locale strings in your project.
- **`defaultLocale`** (string): Default locale to use.
- **`localeSet`** (object): Object containing translations for each locale.

#### Example:

```tsx
const i18nStore = createI18nStore({
  supportedLocales: ['ko', 'en'],
  defaultLocale: 'ko',
  localeSet: { ko, en },
});
```

---

### `createI18nContext`

Generates React context, including the `IntlProvider` and `useTranslation`.

#### Parameters:

- **`i18nStore`**: Output of `createI18nStore`.

#### Example:

```tsx
const { IntlProvider, useTranslation } = createI18nContext(i18nStore);
```

---

### `IntlProvider`

A React component to provide translations to child components.

#### Props:

- **`currentLocale`**: Key locale. This will determine which locale to use for translations data.
- **`children`**: React children.

#### Example:

```tsx
<IntlProvider currentLocale="ko">{children}</IntlProvider>
```

---

### `useTranslation`

A hook to access translations in your components.

#### Parameters:

- **`sheetTitle`**: The sheet title of the translation group.

#### Example:

```tsx
const { t } = useTranslation('header');
const translatedMessage = t('login');
```

### `t Function`

The t function is used to retrieve a translation string based on a key and optionally interpolate variables. It provides flexibility to include dynamic values, such as plain strings or React components, for enhanced localization capabilities.

#### Parameters:

- key (string): The translation key to retrieve the localized string.

```tsx
const translatedMessage = t('login'); // login is key
```

- values (object, optional): An object containing key-value pairs to interpolate into the translation string.

```tsx
// John Doe shown
const translatedMessage = t('{username} shown', { username: 'John Doe' });
```

> 💡 Note: The values object can contain any type of data, including React components.
>
> ```tsx
> // <Username /> shown
> const translatedMessage = t('{username} shown', { username: <Username /> });
> ```

## 🛠 Error Handling

Custom error messages help identify misconfigurations:

1. **Invalid Params**: Ensure `supportedLocales`, `defaultLocale`, and `localeSet` are correctly provided.
2. **Missing Default Locale**: The `defaultLocale` must exist in `supportedLocales`.
3. **Invalid LocaleSet**: Ensure the `localeSet` keys match `supportedLocales`.

## 🌍 Example Usage in Applications

```tsx
import { useTranslation } from './i18nContext';

const TableComponent = () => {
  const { t } = useTranslation('header');

  const columns = [
    {
      title: t('logout'),
      dataIndex: 'action',
    },
  ];

  return <Table columns={columns} />;
};
```

## 📜 Library Versions 🔢

This package supports the following library versions:

- **React**: `^19.0.0`
- **React Intl**: `^7.0.4`

## 📜 License

This project is licensed under the ISC License.

## 👤 Author

**devAnderson**  
[GitHub](https://github.com/chltjdrhd777)  
[chltjdrhd777@gmail.com](mailto:chltjdrhd777@gmail.com)

</details>

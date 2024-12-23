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
  <summary>📄 Server export function - `sheet-i18n/exporter`</summary>

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
  defaultLocale: 'default-language',
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

---

### Exporter Methods 🛠️

#### `getTranslations` 📝

- **Description**: This function retrieves the translation data, which is structured by locale keys (such as "ko", "en", etc.). It collects all translations from the specified sheet, replaces any placeholders, and prepares them to be sent to the client in the response body. Each key corresponds to a language, and the value for each key is an object containing the translated text for that locale.

- **Type**: Function
- **Parameters**: None
- **Returns**: An object where each key is a locale (e.g., "ko", "en"), and the value is the respective translation data for that locale.

#### Example:

If the headers in your Google Sheets are `["ko", "en", ...]`, the result returned by `getTranslations` will look like this:

```json
{
  "ko": {
    "greeting": "안녕하세요",
    "farewell": "안녕히 가세요"
  },
  "en": {
    "greeting": "Hello",
    "farewell": "Goodbye"
  },
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

```json
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

---

### API Documentation 📚

You can refer to the Google Sheets API for integration details and configuration. The following link provides extensive documentation on how to interact with Google Sheets API for accessing your spreadsheet data:

[Google Sheets API Documentation](https://developers.google.com/sheets/api)

---

### Exporting Data Format 🗂️

The exported translations will be saved in a format that is easy to use for localization purposes. Each translation is stored in its respective locale folder, with a structured format.

</details>

<!--
<details>
  <summary>⚛️ React Component - `sheet-i18n/react`</summary>

#### `sheet-i18n/react`

The **React component** subpackage allows you to use translations within your React application. This is ideal for rendering dynamic translations on the frontend, where you may need to load and display translations from a Google Spreadsheet based on the current locale selected by the user.

```jsx
import { useState, useEffect } from 'react';
import { googleSheetExporter } from 'sheet-i18n/react';

const TranslationProvider = ({ children }) => {
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const exporter = await googleSheetExporter({
        credentials: {
          sheetId: 'your-google-sheet-id',
          clientEmail: 'your-client-email',
          privateKey: 'your-private-key',
        },
        defaultLocale: 'en',
      });
      const data = await exporter.getTranslations();
      setTranslations(data);
    };

    fetchTranslations();
  }, []);

  return (
    <TranslationContext.Provider value={translations}>
      {children}
    </TranslationContext.Provider>
  );
};
```

This is useful for applications where translations need to be loaded and displayed dynamically from a backend (e.g., Google Sheets). You can use this provider to wrap your app and pass translations to components.

</details>

---

## Additional Notes 📌

- **Locales**: Ensure that the first row in your Google Sheet contains the locale headers (e.g., `["ko", "en", "fr"]`).
- **Placeholders**: Any placeholders within the translation strings will be replaced during the export process. -->
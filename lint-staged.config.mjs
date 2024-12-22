import { relative } from 'path';
import { ESLint } from 'eslint';

const getIgnoredFiles = async (files) => {
  const cwd = process.cwd();
  const eslint = new ESLint();
  const relativePaths = files.map((file) => relative(cwd, file));
  const isIgnored = await Promise.all(
    relativePaths.map((file) => eslint.isPathIgnored(file))
  );
  const filteredFiles = files.filter((_, i) => !isIgnored[i]);

  return filteredFiles.join(' ');
};

export default {
  '**/*.{js,ts,jsx,tsx}': async (files) => {
    const filesToLint = await getIgnoredFiles(files);

    return [`eslint --fix ${filesToLint}`];
  },
  '**/*.css': async (files) => {
    const filesToLint = await getIgnoredFiles(files);

    return [
      `prettier --config .prettierrc.json --ignore-path --write ${filesToLint}`,
    ];
  },
};

const fs = require('fs');

const mkdirp = require('mkdirp');

// helpers
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const camelCase = (str) => {
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
};

// workspaces in packages
const workspaces = ['configs', 'google-sheet-exporter', 'sheet-i18n', 'utils'];

// generate targets
const generators = ['util'];

// dir name for generated files
const defaultOutDirs = {
  util: 'utils',
};

/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = function main(plop) {
  // set helper functions
  plop.setHelper('capitalize', (text) => capitalize(camelCase(text)));
  plop.setHelper('camelCase', (text) => camelCase(text));

  // define generators
  // gen is the member name of the generator array
  generators.forEach((gen) => {
    plop.setGenerator(gen, {
      description: `Generates a new ${gen}`,
      prompts: [
        {
          type: 'input',
          name: `${gen}Name`,
          message: `Enter the name of the new ${gen}:`,
          validate: (value) => {
            if (!value) return `${gen} name is required`;
            if (value !== value.toLowerCase()) {
              return `${gen} name must be in lowercase`;
            }
            if (value.includes(' ')) {
              return `${gen} name cannot have spaces`;
            }

            return true;
          },
        },
        {
          type: 'input',
          name: 'description',
          message: `Provide a description for the ${gen}:`,
        },
        {
          type: 'list',
          name: 'outDir',
          message: `Where should this ${gen} be created?`,
          default: defaultOutDirs[gen],
          choices: workspaces,
          validate: (value) => (value ? true : `outDir is required`),
        },
      ],
      actions(answers) {
        const actions = [];

        if (!answers) return actions;

        const { description, outDir } = answers;
        const generatorName = answers[`${gen}Name`] ?? '';

        const destPath = `packages/${outDir}/${generatorName}`;
        const srcPath = `${destPath}/src`;

        actions.push(() => {
          mkdirp.sync(srcPath);
          if (!fs.existsSync(`${srcPath}/index.ts`)) {
            fs.writeFileSync(
              `${srcPath}/index.ts`,
              `// Entry file for ${generatorName}`
            );
          }

          return `Created src folder and initialized index.ts at ${srcPath}`;
        });

        actions.push({
          type: 'addMany',
          templateFiles: `plop-templates/${gen}/**`,
          destination: `packages/${outDir}/{{dashCase ${gen}Name}}`,
          base: `plop-templates/${gen}`,
          data: {
            [`${gen}Name`]: generatorName,
            description,
            outDir,
          },
          abortOnFail: true,
        });

        return actions;
      },
    });
  });
};

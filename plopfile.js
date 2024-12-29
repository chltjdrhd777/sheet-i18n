const fs = require('fs');

const mkdirp = require('mkdirp');

// helpers
const capitalize = (str = '') => {
  if (!str) return '';

  return str.charAt(0).toUpperCase() + str.slice(1);
};

const camelCase = (str = '') => {
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
};

// workspaces in packages
const workspaces = ['packages', 'utils'];
// dir name for generated files
const DEFAULT_OUT_DIR = 'packages';
const defaultOutDirs = workspaces.reduce((acc, cur) => {
  acc[cur] = cur;

  return acc;
}, {});

/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = function main(plop) {
  // set helper functions
  plop.setHelper('capitalize', (text) => capitalize(camelCase(text)));
  plop.setHelper('camelCase', (text) => camelCase(text));

  // define generators
  // workspace is the member name of the generator array
  workspaces.forEach((workspace) => {
    plop.setGenerator(workspace, {
      description: `Generates a new ${workspace}`,
      prompts: [
        {
          type: 'input',
          name: `${workspace}Name`,
          message: `Enter the name of the new ${workspace}:`,
          validate: (value) => {
            if (!value) return `${workspace} name is required`;
            if (value !== value.toLowerCase()) {
              return `${workspace} name must be in lowercase`;
            }
            if (value.includes(' ')) {
              return `${workspace} name cannot have spaces`;
            }

            return true;
          },
        },
        {
          type: 'input',
          name: 'description',
          message: `Provide a description for the ${workspace}:`,
        },
        {
          type: 'list',
          name: 'outDir',
          message: `Where should this ${workspace} be created?`,
          default: defaultOutDirs[workspace],
          choices: workspaces,
          validate: (value) => (value ? true : `outDir is required`),
        },
      ],
      actions(answers) {
        const actions = [];

        if (!answers) return actions;

        const { description, outDir } = answers;
        const generatorName = answers[`${workspace}Name`] ?? '';

        const _outDir =
          outDir === DEFAULT_OUT_DIR ? outDir : `${DEFAULT_OUT_DIR}/${outDir}`;
        const destPath = `${_outDir}/${generatorName}`;
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
          templateFiles: `plop-templates/${workspace}/**`,
          destination: `${_outDir}/{{${workspace}Name}}`,
          base: `plop-templates/${workspace}`,
          data: {
            [`${workspace}Name`]: generatorName,
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

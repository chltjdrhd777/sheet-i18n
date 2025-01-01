#!/usr/bin/env node

import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import util from 'util';

import * as parser from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import chokidar from 'chokidar';

import { ActionParams } from '../../../@types';

const execPromise = util.promisify(exec);

type TranslationStore = Record<string, Set<string>>;
interface watchActionParams extends ActionParams {
  directory?: string;
}

const translationStore: TranslationStore = {};

export function watchAction({ logger, program, directory }: watchActionParams) {
  console.log('Starting sheet-i18n monitor...');

  const watchPath = path.resolve(process.cwd(), directory ?? 'src');

  const watcher = chokidar.watch(path.resolve(process.cwd(), watchPath), {
    ignored: /node_modules/,
    persistent: true,
  });

  watcher.on('change', async (filePath: string) => {
    try {
      console.log(`File changed: ${filePath}`);
      const changedFiles = await getGitChangedFiles();

      if (changedFiles.length === 0) {
        console.log('No files with Git changes detected.');

        return;
      }

      console.log('Git-tracked changed files:', changedFiles);

      for (const file of changedFiles) {
        console.log(`Analyzing Git-tracked file: ${file}`);
        const diffContent = await getGitDiffForFile(file);

        await analyzeFileForTranslationRelationships(file, diffContent);
      }

      console.log(
        'Updated Relationship Store:',
        JSON.stringify(translationStore, null, 2)
      );
    } catch (error) {
      console.error('Error processing file changes:', error);
    }
  });

  process.on('SIGINT', () => {
    console.log('Shutting down sheet-i18n monitor gracefully...');
    watcher.close();
    console.log(
      'Final Relationship Store:',
      JSON.stringify(translationStore, null, 2)
    );
    process.exit(0);
  });

  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
  });

  process.on(
    'unhandledRejection',
    (reason: unknown, promise: Promise<unknown>) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    }
  );
}

async function getGitChangedFiles(): Promise<string[]> {
  try {
    const { stdout } = await execPromise('git diff --name-only');
    const allChangedFiles = stdout.split('\n').filter(Boolean);

    return allChangedFiles.filter((file) => /\.(tsx|ts|jsx|js)$/.test(file));
  } catch (error) {
    console.error('Error getting list of Git changed files:', error);

    return [];
  }
}

async function getGitDiffForFile(filePath: string): Promise<string> {
  try {
    const { stdout } = await execPromise(`git diff ${filePath}`);

    return stdout;
  } catch (error) {
    console.error(`Error getting git diff for file ${filePath}:`, error);

    return '';
  }
}

async function analyzeFileForTranslationRelationships(
  filePath: string,
  diffContent: string
): Promise<void> {
  try {
    const code = await fs.readFile(filePath, 'utf-8');
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    console.log(`Analyzing file: ${filePath}`);

    traverse(ast, {
      CallExpression(path: NodePath<t.CallExpression>) {
        const callee = path.node.callee;

        if (t.isIdentifier(callee) && callee.name === 'useTranslation') {
          const sheetTitleArg = path.node.arguments[0];

          if (sheetTitleArg && t.isStringLiteral(sheetTitleArg)) {
            const sheetTitle = sheetTitleArg.value;

            const parentPath = path.findParent((p) =>
              p.isVariableDeclarator()
            ) as NodePath<t.VariableDeclarator>;

            if (parentPath) {
              const idNode = parentPath.node.id;

              if (t.isObjectPattern(idNode)) {
                const tProperty = idNode.properties.find(
                  (prop) =>
                    t.isObjectProperty(prop) &&
                    t.isIdentifier(prop.key) &&
                    prop.key.name === 't'
                ) as t.ObjectProperty;

                if (tProperty) {
                  const aliasName = t.isIdentifier(tProperty.value)
                    ? tProperty.value.name
                    : tProperty.key.type;

                  const collectedIds = new Set<string>();

                  path.scope.path.traverse({
                    CallExpression(innerPath: NodePath<t.CallExpression>) {
                      const innerCallee = innerPath.node.callee;

                      if (
                        t.isIdentifier(innerCallee) &&
                        innerCallee.name === aliasName &&
                        innerPath.node.arguments[0] &&
                        t.isStringLiteral(innerPath.node.arguments[0]) &&
                        diffContent.includes(innerPath.node.arguments[0].value)
                      ) {
                        collectedIds.add(innerPath.node.arguments[0].value);
                      }
                    },
                  });

                  if (!translationStore[sheetTitle]) {
                    translationStore[sheetTitle] = new Set();
                  }
                  collectedIds.forEach((id) =>
                    translationStore[sheetTitle].add(id)
                  );
                }
              }
            }
          }
        }
      },
    });
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error);
  }
}

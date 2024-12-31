// #!/usr/bin/env node

// import chokidar from 'chokidar';
// import { promises as fs } from 'fs';
// import { exec } from 'child_process';
// import path from 'path';
// import util from 'util';
// import * as babelParser from '@babel/parser';
// import traverse from '@babel/traverse';

// const execPromise = util.promisify(exec);

// // --------------- TranslationStore ----------------
// class TranslationStore {
//   private store: Map<string, Set<string>>;

//   constructor() {
//     this.store = new Map<string, Set<string>>();
//   }

//   add(sheetTitle: string, translationKey: string): void {
//     if (!this.store.has(sheetTitle)) {
//       this.store.set(sheetTitle, new Set<string>());
//     }
//     this.store.get(sheetTitle)?.add(translationKey);
//   }

//   getStore(): Map<string, Set<string>> {
//     return this.store;
//   }

//   printStore(): void {
//     console.log('Current Translation Store:');
//     for (const [sheetTitle, keys] of this.store.entries()) {
//       console.log(`Sheet: ${sheetTitle}, Keys: ${Array.from(keys).join(', ')}`);
//     }
//   }
// }

// // --------------- GitService ----------------
// class GitService {
//   async getChangedFiles(): Promise<string[]> {
//     try {
//       const { stdout } = await execPromise('git diff --name-only');
//       return stdout.split('\n').filter(Boolean);
//     } catch (error) {
//       console.error('Error fetching changed files:', error);
//       return [];
//     }
//   }

//   async getFileDiff(filePath: string): Promise<string> {
//     try {
//       const { stdout } = await execPromise(`git diff ${filePath}`);
//       return stdout;
//     } catch (error) {
//       console.error(`Error fetching diff for ${filePath}:`, error);
//       return '';
//     }
//   }
// }

// // --------------- TranslationAnalyzer ----------------
// class TranslationAnalyzer {
//   private store: TranslationStore;

//   constructor(store: TranslationStore) {
//     this.store = store;
//   }

//   async analyzeFile(filePath: string, diffContent: string): Promise<void> {
//     try {
//       const code = await fs.readFile(filePath, 'utf-8');
//       const ast = babelParser.parse(code, {
//         sourceType: 'module',
//         plugins: ['typescript', 'jsx'],
//       });

//       traverse(ast, {
//         CallExpression: (path) => {
//           if (
//             path.node.callee.type === 'Identifier' &&
//             path.node.callee.name === 'useTranslation'
//           ) {
//             const sheetTitleArg = path.node.arguments[0];
//             if (sheetTitleArg && sheetTitleArg.type === 'StringLiteral') {
//               const sheetTitle = sheetTitleArg.value;
//               this.collectTranslations(path, sheetTitle, diffContent);
//             }
//           }
//         },
//       });
//     } catch (error) {
//       console.error(`Error analyzing file ${filePath}:`, error);
//     }
//   }

//   private collectTranslations(
//     path: babelParser.NodePath<any>,
//     sheetTitle: string,
//     diffContent: string
//   ): void {
//     const parentPath = path.findParent((p) => p.isVariableDeclarator());
//     if (parentPath?.node.id.type === 'ObjectPattern') {
//       const tProperty = parentPath.node.id.properties.find(
//         (prop) =>
//           prop.type === 'ObjectProperty' &&
//           prop.key.type === 'Identifier' &&
//           prop.key.name === 't'
//       );

//       if (tProperty && tProperty.value.type === 'Identifier') {
//         const aliasName = tProperty.value.name;
//         const collectedKeys = new Set<string>();

//         path.scope.path.traverse({
//           CallExpression(innerPath) {
//             if (
//               innerPath.node.callee.type === 'Identifier' &&
//               innerPath.node.callee.name === aliasName &&
//               innerPath.node.arguments[0]?.type === 'StringLiteral' &&
//               diffContent.includes(innerPath.node.arguments[0].value)
//             ) {
//               collectedKeys.add(innerPath.node.arguments[0].value);
//             }
//           },
//         });

//         collectedKeys.forEach((key) => this.store.add(sheetTitle, key));
//       }
//     }
//   }
// }

// // --------------- FileWatcher ----------------
// class FileWatcher {
//   private directory: string;
//   private gitService: GitService;
//   private analyzer: TranslationAnalyzer;
//   private watcher: chokidar.FSWatcher | null;

//   constructor(
//     directory: string,
//     gitService: GitService,
//     analyzer: TranslationAnalyzer
//   ) {
//     this.directory = directory;
//     this.gitService = gitService;
//     this.analyzer = analyzer;
//     this.watcher = null;
//   }

//   start(): void {
//     console.log('Starting file watcher...');
//     this.watcher = chokidar.watch(this.directory, {
//       ignored: /node_modules/,
//       persistent: true,
//     });

//     this.watcher.on('change', this.handleFileChange.bind(this));

//     process.on('SIGINT', this.shutdown.bind(this));
//   }

//   private async handleFileChange(filePath: string): Promise<void> {
//     console.log(`File changed: ${filePath}`);
//     try {
//       const changedFiles = await this.gitService.getChangedFiles();
//       if (changedFiles.length === 0) {
//         console.log('No Git-tracked changes detected.');
//         return;
//       }

//       console.log('Analyzing changed files...');
//       for (const file of changedFiles) {
//         const diffContent = await this.gitService.getFileDiff(file);
//         await this.analyzer.analyzeFile(file, diffContent);
//       }
//     } catch (error) {
//       console.error('Error handling file change:', error);
//     }
//   }

//   private shutdown(): void {
//     console.log('Shutting down gracefully...');
//     this.watcher?.close();
//     console.log('Watcher stopped.');
//     process.exit(0);
//   }
// }

// // --------------- Main Entry Point ----------------
// (async function main(): Promise<void> {
//   const translationStore = new TranslationStore();
//   const gitService = new GitService();
//   const analyzer = new TranslationAnalyzer(translationStore);

//   const fileWatcher = new FileWatcher(
//     path.resolve(process.cwd(), 'src'),
//     gitService,
//     analyzer
//   );

//   fileWatcher.start();
// })();

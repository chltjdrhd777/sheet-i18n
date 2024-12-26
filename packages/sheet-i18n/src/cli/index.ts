#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import { Server } from 'socket.io';
import inquirer from 'inquirer';

interface AddTranslationData {
  sheetTitle: string;
  cellValue: string;
}

const bold = '\x1b[1m';
const reset = '\x1b[0m';
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const magenta = '\x1b[35m';
const red = '\x1b[31m';

const DEFAULT_PORT = 7777;
const args = process.argv.slice(2);
const portArg = args.find((arg) => arg.startsWith('--port='));
const PORT = portArg ? parseInt(portArg.split('=')[1], 10) : DEFAULT_PORT;
const translationStore = new Map<string, Set<string>>();

console.log(
  `\n${cyan}🌐 ${bold}Socket Server for Translation Data Collection${reset}`
);
console.log(`${yellow}- Real-time translation data exchange.${reset}`);
console.log(`${yellow}- Easy-to-use menu for managing Google Sheets.${reset}`);
console.log(`${cyan}Go on translating text in client side code${reset}\n`);

function socketServer() {
  const io = new Server(PORT, {
    cors: {
      origin: '*',
    },
  });

  console.log(
    `${cyan}🚀 ${bold}Socket server running on http://localhost:${PORT}${reset}`
  );

  io.on('connection', (socket) => {
    console.log(`${green}🟢 ${bold}Client connected:${reset}`, socket.id);

    socket.on('disconnect', () => {
      console.log(
        `${magenta}🔴 ${bold}Client disconnected:${reset}`,
        socket.id
      );
    });

    socket.on('add-translation', (data: AddTranslationData) => {
      const { sheetTitle, cellValue } = data ?? {};

      if (!sheetTitle) return;

      if (!translationStore.has(data.sheetTitle)) {
        translationStore.set(sheetTitle, new Set());
      }

      translationStore.get(sheetTitle)?.add(cellValue);

      //   console.log(
      //     `${green}✅ ${bold}Translation updated for sheet:${reset} ${data.sheetTitle}, value: ${data.cellValue}`
      //   );
    });
  });

  showMenu();
}

async function showMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Choose an action:',
      choices: [
        {
          name: 'View Current State of Stored Translation Data',
          value: 'view_state',
        },
        { name: 'Update Google Sheet using Sheet API', value: 'update_sheet' },
        { name: 'Exit server', value: 'exit' },
      ],
    },
  ]);

  switch (action) {
    case 'view_state':
      console.log(
        `${cyan}ℹ️ ${bold}Current state of stored translation data:${reset}\n\n`,
        `${JSON.stringify({ hello: 'world' }, null, 2)}`
      );

      break;
    case 'update_sheet':
      await handleUpdateSheet();
      break;

    case 'exit':
      console.log(`${red}🛑 ${bold}Shutting down server...${reset}`);
      process.exit(0);

    default:
      console.log('Invalid choice.');
  }

  showMenu();
}

async function handleUpdateSheet() {
  const cwdConfigPath = path.resolve(process.cwd(), 'sheetI18n.config.json');
  let configPath;

  if (fs.existsSync(cwdConfigPath)) {
    console.log(
      `${cyan}ℹ️ ${bold}Found sheetI18n.config.json in the current working directory.${reset}`
    );
    const { useCwdConfig } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useCwdConfig',
        message:
          'Do you want to use the configuration from the current working directory?',
        default: true,
      },
    ]);

    if (useCwdConfig) {
      configPath = cwdConfigPath;
    }
  }

  if (!configPath) {
    const input = await inquirer.prompt([
      {
        type: 'input',
        name: 'configPath',
        message: 'Enter the absolute path to sheetI18n.config.json:',
        validate: (input) => {
          if (!fs.existsSync(input)) {
            return 'The file does not exist. Please provide a valid path.';
          }

          return true;
        },
      },
    ]);

    configPath = input.configPath;
  }

  try {
    const config = JSON.parse(
      fs.readFileSync(path.resolve(configPath), 'utf-8')
    );

    console.log(
      `${green}✅ ${bold}Configuration loaded successfully:${reset}`,
      config
    );
  } catch (error) {
    console.error(
      `${red}❌ ${bold}Failed to read or parse the configuration file:${reset}`,
      (error as Error).message
    );
  }
}

socketServer();

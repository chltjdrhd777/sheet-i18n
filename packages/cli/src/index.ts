#!/usr/bin/env node
import { CLIController } from './Services/CLI';

(async () => {
  // initialize command
  const commandController = new CLIController();

  await commandController.initializeCLI();
})();

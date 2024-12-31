#!/usr/bin/env node

import { flagController } from './Services/Flag';

(async () => {
  await flagController.installFlagHandlers();

  console.log('🚀 Hello World!');
})();

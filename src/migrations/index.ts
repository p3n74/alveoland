import * as migration_20261016_233344_initial from './20261016_233344_initial';
import * as migration_20261016_235619_round2_buying_basics from './20261016_235619_round2_buying_basics';

export const migrations = [
  {
    up: migration_20261016_233344_initial.up,
    down: migration_20261016_233344_initial.down,
    name: '20261016_233344_initial',
  },
  {
    up: migration_20261016_235619_round2_buying_basics.up,
    down: migration_20261016_235619_round2_buying_basics.down,
    name: '20261016_235619_round2_buying_basics'
  },
];

import * as migration_20261016_233344_initial from './20261016_233344_initial';

export const migrations = [
  {
    up: migration_20261016_233344_initial.up,
    down: migration_20261016_233344_initial.down,
    name: '20261016_233344_initial'
  },
];

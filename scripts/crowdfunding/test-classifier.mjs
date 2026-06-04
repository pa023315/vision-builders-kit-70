import assert from 'node:assert/strict';

import {
  classifyProject,
  resolveEffectiveClassification,
} from './classifier.mjs';

const approvedGame = classifyProject({
  title: 'Pixel art roguelike RPG',
  description:
    'A pixel art roguelike RPG for Steam and Nintendo Switch with a playable demo, trailer, and gameplay footage.',
});
assert.equal(approvedGame.auto_classification, 'approved');
assert.ok(approvedGame.confidence >= 65);

const rejectedBoardGame = classifyProject({
  title: 'Tabletop board game',
  description:
    'A tabletop board game with dice, miniatures, and card game mechanics.',
});
assert.equal(rejectedBoardGame.auto_classification, 'rejected');

const mixedProject = classifyProject({
  title: 'Adventure game artbook',
  description:
    'An adventure game artbook campaign with a Steam key reward, merch, and behind-the-scenes goods.',
});
assert.equal(mixedProject.auto_classification, 'review');

const ignoredProject = resolveEffectiveClassification({
  ignore_forever: true,
  manual_classification: 'approved',
  auto_classification: 'approved',
});
assert.equal(ignoredProject, 'rejected');

const manuallyRejectedProject = resolveEffectiveClassification({
  manual_classification: 'rejected',
  auto_classification: 'approved',
});
assert.equal(manuallyRejectedProject, 'rejected');

console.log('classifier checks passed');

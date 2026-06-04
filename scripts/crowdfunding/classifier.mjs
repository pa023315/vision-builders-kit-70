const POSITIVE_SIGNALS = [
  'steam',
  'nintendo switch',
  'playstation',
  'ps5',
  'xbox',
  'pc',
  'windows',
  'mac',
  'itch.io',
  'gameplay',
  'demo',
  'playable demo',
  'trailer',
  'early access',
  'alpha',
  'beta',
  'unity',
  'unreal',
  'godot',
  'game engine',
  'rpg',
  'jrpg',
  'action game',
  'adventure game',
  'visual novel',
  'metroidvania',
  'roguelike',
  'simulation',
  'pixel art',
  'indie game',
  'ゲーム',
  'ビデオゲーム',
  'デジタルゲーム',
  '体験版',
  'デモ版',
  'ゲームプレイ',
];

const NEGATIVE_SIGNALS = [
  'board game',
  'tabletop',
  'card game',
  'trpg',
  'dice',
  'miniature',
  'tcg',
  'playing cards',
  'book',
  'comic',
  'manga',
  'artbook',
  'novel',
  'soundtrack only',
  'merch',
  'figure',
  'plush',
  'event',
  'exhibition',
  'vtuber event',
  'goods',
  'ボードゲーム',
  'カードゲーム',
  'グッズ',
  '書籍',
  '漫画',
  '展示',
  'イベント',
];

function collectText(value) {
  if (value == null) {
    return [];
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectText);
  }

  if (typeof value === 'object') {
    return Object.values(value).flatMap(collectText);
  }

  return [];
}

function findSignals(text, signals) {
  return signals.filter((signal) => text.includes(signal.toLowerCase()));
}

function calculateConfidence(classification, positiveMatches, negativeMatches) {
  const strongestCount =
    classification === 'approved'
      ? positiveMatches.length
      : classification === 'rejected'
        ? negativeMatches.length
        : Math.min(positiveMatches.length, negativeMatches.length);

  if (classification === 'review') {
    return Math.min(75, 45 + strongestCount * 8);
  }

  return Math.min(95, 45 + strongestCount * 12);
}

function buildReasons(positiveMatches, negativeMatches) {
  const reasons = [];

  if (positiveMatches.length > 0) {
    reasons.push(`positive signals: ${positiveMatches.join(', ')}`);
  }

  if (negativeMatches.length > 0) {
    reasons.push(`negative signals: ${negativeMatches.join(', ')}`);
  }

  if (positiveMatches.length > 0 && negativeMatches.length > 0) {
    reasons.push('mixed crowdfunding signals require manual review');
  }

  if (reasons.length === 0) {
    reasons.push('no strong crowdfunding classification signals found');
  }

  return reasons;
}

export function resolveEffectiveClassification(project = {}) {
  if (project.ignore_forever === true) {
    return 'rejected';
  }

  if (project.manual_classification) {
    return project.manual_classification;
  }

  return project.auto_classification || 'review';
}

export function classifyProject(project = {}) {
  const text = collectText(project).join(' ').toLowerCase();
  const positiveMatches = findSignals(text, POSITIVE_SIGNALS);
  const negativeMatches = findSignals(text, NEGATIVE_SIGNALS);

  let auto_classification = 'review';
  if (positiveMatches.length > 0 && negativeMatches.length === 0) {
    auto_classification = 'approved';
  } else if (negativeMatches.length > 0 && positiveMatches.length === 0) {
    auto_classification = 'rejected';
  }

  return {
    auto_classification,
    confidence: calculateConfidence(
      auto_classification,
      positiveMatches,
      negativeMatches,
    ),
    classification_reasons: buildReasons(positiveMatches, negativeMatches),
  };
}

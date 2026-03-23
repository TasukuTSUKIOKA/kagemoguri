const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const smokeStatusEl = document.getElementById("smoke-status");
const exposureFillEl = document.getElementById("exposure-fill");
const messageEl = document.getElementById("message");
const messageTitleEl = messageEl.querySelector(".message-title");
const messageTextEl = messageEl.querySelector(".message-text");
const sharePanel = document.getElementById("share-panel");
const sharePreview = document.getElementById("share-preview");
const shareFeedback = document.getElementById("share-feedback");
const shareXButton = document.getElementById("share-x-button");
const shareCopyButton = document.getElementById("share-copy-button");
const controlButtons = document.querySelectorAll(".control-button");
const smokeButton = document.querySelector('[data-control="smoke"]');
const toggleButton = document.querySelector('[data-control="toggle"]');
const localeButtons = document.querySelectorAll(".locale-button");
const soundButtons = document.querySelectorAll(".sound-button");
const soundChoiceButtons = document.querySelectorAll("[data-sound-choice]");
const soundModalEl = document.getElementById("sound-modal");
const i18nNodes = document.querySelectorAll("[data-i18n]");

const GAME_VERSION = "1.3.1";
const PROGRESS_STORAGE_KEY = "kagemoguri_progress_v1";
const TITLE_LEVEL_MAX = 10;

const titleThresholds = [
  { level: 1, seconds: 30, titleJa: "影もぐりレベル1", titleEn: "Kagemoguri Level 1" },
  { level: 2, seconds: 45, titleJa: "影もぐりレベル2", titleEn: "Kagemoguri Level 2" },
  { level: 3, seconds: 75, titleJa: "影もぐりレベル3", titleEn: "Kagemoguri Level 3" },
  { level: 4, seconds: 120, titleJa: "影もぐりレベル4", titleEn: "Kagemoguri Level 4" },
  { level: 5, seconds: 200, titleJa: "影もぐりレベル5", titleEn: "Kagemoguri Level 5" },
  { level: 6, seconds: 320, titleJa: "影もぐりレベル6", titleEn: "Kagemoguri Level 6" },
  { level: 7, seconds: 460, titleJa: "影もぐりレベル7", titleEn: "Kagemoguri Level 7" },
  { level: 8, seconds: 600, titleJa: "影もぐりレベル8", titleEn: "Kagemoguri Level 8" },
  { level: 9, seconds: 800, titleJa: "影もぐりレベル9", titleEn: "Kagemoguri Level 9" },
  { level: 10, seconds: 1000, titleJa: "影もぐり伝説", titleEn: "Kagemoguri Legend" },
];

const difficultyTiers = [
  {
    level: 1,
    lightCount: 1,
    speedMultiplier: 1.0,
    feintChance: 0.0,
    speedVarianceMultiplier: 0.8,
    campTriggerTime: 2.4,
    campDriftSpeed: 90,
    campSlowSpeed: 26,
  },
  {
    level: 2,
    lightCount: 2,
    speedMultiplier: 1.04,
    feintChance: 0.1,
    speedVarianceMultiplier: 0.86,
    campTriggerTime: 2.4,
    campDriftSpeed: 90,
    campSlowSpeed: 26,
  },
  {
    level: 3,
    lightCount: 3,
    speedMultiplier: 1.08,
    feintChance: 0.18,
    speedVarianceMultiplier: 0.92,
    campTriggerTime: 2.4,
    campDriftSpeed: 90,
    campSlowSpeed: 27,
  },
  {
    level: 4,
    lightCount: 3,
    speedMultiplier: 1.12,
    feintChance: 0.28,
    speedVarianceMultiplier: 0.98,
    campTriggerTime: 2.4,
    campDriftSpeed: 90,
    campSlowSpeed: 27,
  },
  {
    level: 5,
    lightCount: 3,
    speedMultiplier: 1.16,
    feintChance: 0.38,
    speedVarianceMultiplier: 1.04,
    campTriggerTime: 1.95,
    campDriftSpeed: 106,
    campSlowSpeed: 26,
  },
  {
    level: 6,
    lightCount: 3,
    speedMultiplier: 1.2,
    feintChance: 0.5,
    speedVarianceMultiplier: 1.1,
    campTriggerTime: 1.82,
    campDriftSpeed: 110,
    campSlowSpeed: 26,
  },
  {
    level: 7,
    lightCount: 3,
    speedMultiplier: 1.24,
    feintChance: 0.62,
    speedVarianceMultiplier: 1.16,
    campTriggerTime: 1.68,
    campDriftSpeed: 114,
    campSlowSpeed: 25,
  },
  {
    level: 8,
    lightCount: 4,
    speedMultiplier: 1.28,
    feintChance: 0.74,
    speedVarianceMultiplier: 1.22,
    campTriggerTime: 1.54,
    campDriftSpeed: 118,
    campSlowSpeed: 25,
  },
  {
    level: 9,
    lightCount: 4,
    speedMultiplier: 1.31,
    feintChance: 0.84,
    speedVarianceMultiplier: 1.28,
    campTriggerTime: 1.44,
    campDriftSpeed: 122,
    campSlowSpeed: 24,
  },
  {
    level: 10,
    lightCount: 4,
    speedMultiplier: 1.34,
    feintChance: 0.92,
    speedVarianceMultiplier: 1.34,
    campTriggerTime: 1.34,
    campDriftSpeed: 126,
    campSlowSpeed: 24,
  },
];

const locales = {
  ja: {
    title: "影もぐり",
    eyebrow: "hide in the shadows",
    lead: "光を避けて、影へもぐれ。 見つかりそうになったら煙幕で立て直せ。",
    score_label: "スコア",
    danger_label: "見つかりそう",
    smoke_button: "煙幕",
    smoke_button_ready: "煙幕 使用可 {charges}",
    smoke_button_waiting: "煙幕 準備中 {charges}",
    tip_move: "移動: ← → / A D / 画面ボタン",
    tip_smoke: "煙幕: Shift / 煙幕ボタン",
    tip_toggle: "開始・停止・再開・リトライ: Space / 開始ボタン",
    smoke_ready: "煙幕 使用可 {charges}",
    smoke_cooldown: "煙幕 準備中 {time} {charges}",
    smoke_active: "煙幕 発動中 {time} {charges}",
    toggle_idle: "開始",
    toggle_playing: "停止",
    toggle_paused: "再開",
    toggle_gameover: "再挑戦",
    message_idle_title: "press space",
    message_idle_text: "影へもぐれ。見つかりそうなら煙幕。",
    message_paused_title: "停止中",
    message_paused_text: "Spaceで戻る",
    message_gameover_title: "見つかった。",
    message_gameover_text: "スコア {score}。Spaceまたは再挑戦ボタンでやり直し",
    page_title: "影もぐり",
    sound_on: "Sound On",
    sound_off: "Sound Off",
    score_unit: "秒",
    share_text: "で {score} 隠れることに成功！",
    share_x: "Xでシェア",
    share_copy: "コピー",
    share_copied: "結果をコピーした",
    title_rank_none: "称号なし",
    result_survived: "生存",
    result_new_title: "新称号: {title}",
    result_current_title: "現在の最高称号: {title}",
    result_next_title: "次の{title}まであと{seconds}",
    result_legend_cleared: "影もぐり伝説、達成済み",
    message_gameover_retry: "Spaceまたは再挑戦ボタンでやり直し",
  },
  en: {
    title: "Kagemoguri",
    eyebrow: "hide in the shadows",
    lead: "Dodge the light and slip into the shadows. If you are about to be seen, recover with smoke.",
    score_label: "Score",
    danger_label: "spotted soon",
    smoke_button: "Smoke",
    smoke_button_ready: "Smoke Ready {charges}",
    smoke_button_waiting: "Smoke Loading {charges}",
    tip_move: "Move: ← → / A D / on-screen buttons",
    tip_smoke: "Smoke: Shift / smoke button",
    tip_toggle: "Start / pause / resume / retry: Space / start button",
    smoke_ready: "Smoke Ready {charges}",
    smoke_cooldown: "Smoke Loading {time} {charges}",
    smoke_active: "Smoke Active {time} {charges}",
    toggle_idle: "Start",
    toggle_playing: "Pause",
    toggle_paused: "Resume",
    toggle_gameover: "Retry",
    message_idle_title: "press space",
    message_idle_text: "Hide in the shadows. Use smoke if you are about to be seen.",
    message_paused_title: "paused",
    message_paused_text: "Press Space to return",
    message_gameover_title: "spotted.",
    message_gameover_text: "Score {score}. Press Space or Retry to try again",
    page_title: "Kagemoguri",
    sound_on: "Sound On",
    sound_off: "Sound Off",
    score_unit: "sec",
    share_text: "I stayed hidden for {score}!",
    share_x: "Share on X",
    share_copy: "Copy",
    share_copied: "Result copied",
    title_rank_none: "No Title",
    result_survived: "Survived",
    result_new_title: "New Title: {title}",
    result_current_title: "Highest Title: {title}",
    result_next_title: "Next: {title} in {seconds}",
    result_legend_cleared: "Kagemoguri Legend achieved",
    message_gameover_retry: "Press Space or Retry to try again",
  },
};

const keys = {
  left: false,
  right: false,
};

const game = {
  width: canvas.width,
  height: canvas.height,
  state: "idle",
  time: 0,
  exposure: 0,
  maxExposure: 100,
  score: 0,
  gameOverFade: 0,
  locale: "ja",
  soundEnabled: true,
  soundChoiceDone: false,
  difficultyLevel: 1,
  currentTier: difficultyTiers[0],
  latestUnlockedTitles: [],
  progress: {
    bestTime: 0,
    unlockedLevel: 0,
  },
};

const smoke = {
  active: false,
  activeTime: 0,
  duration: 2.5,
  cooldown: 18,
  maxCharges: 2,
  charges: 2,
  rechargeTimer: 0,
};

const player = {
  width: 34,
  height: 44,
  x: canvas.width / 2 - 17,
  y: canvas.height - 76,
  speed: 320,
  speedPenaltyTimer: 0,
  speedPenaltyMultiplier: 1,
};

const camp = {
  anchorX: player.x + player.width / 2,
  stillTime: 0,
  targetLightIndex: -1,
  triggerTime: 2.4,
  releaseDistance: 36,
  driftSpeed: 90,
  slowSpeed: 26,
};

const defaultCampValues = {
  triggerTime: camp.triggerTime,
  driftSpeed: camp.driftSpeed,
  slowSpeed: camp.slowSpeed,
};

const pillars = [
  { x: 150, width: 60, top: 150 },
  { x: 430, width: 72, top: 220 },
  { x: 740, width: 56, top: 180 },
];

const lights = [
  {
    x: 180,
    y: 70,
    spread: 72,
    speed: 140,
    direction: 1,
  },
];

const lightSpawnConfigs = {
  opening: [
    {
      minX: 120,
      maxX: 260,
      y: 70,
      spread: 72,
      baseSpeed: 140,
      direction: 1,
      speedVariance: 30,
    },
    {
      minX: 660,
      maxX: 820,
      y: 70,
      spread: 72,
      baseSpeed: 140,
      direction: -1,
      speedVariance: 30,
    },
  ],
  second: [
    {
      minX: 120,
      maxX: 260,
      y: 90,
      spread: 58,
      baseSpeed: 175,
      direction: 1,
      speedVariance: 36,
    },
    {
      minX: 660,
      maxX: 820,
      y: 90,
      spread: 58,
      baseSpeed: 175,
      direction: -1,
      speedVariance: 36,
    },
  ],
  third: [
    {
      minX: 200,
      maxX: 360,
      y: 60,
      spread: 46,
      baseSpeed: 180,
      direction: 1,
      speedVariance: 42,
    },
    {
      minX: 360,
      maxX: 600,
      y: 60,
      spread: 46,
      baseSpeed: 180,
      direction: randomDirection,
      speedVariance: 42,
    },
    {
      minX: 600,
      maxX: 760,
      y: 60,
      spread: 46,
      baseSpeed: 180,
      direction: -1,
      speedVariance: 42,
    },
  ],
};

const audioState = {
  enabled: false,
  lastAlertAt: 0,
};

const sfxSpriteMap = {
  start: { start: 0.0, duration: 1.0, volume: 0.65 },
  smoke: { start: 1.25, duration: 2.0, volume: 0.75 },
  alert: { start: 3.5, duration: 2.0, volume: 0.45 },
  gameover: { start: 5.75, duration: 1.0, volume: 0.8 },
};

const sounds = {
  bgm: createAudio("sounds/bgm.mp3", 0.35, true),
  sprite: createAudio("sounds/sfx-sprite.mp3", 1),
};

function createAudio(src, volume, loop = false) {
  const audio = new Audio(src);
  audio.preload = "auto";
  audio.volume = volume;
  audio.loop = loop;
  audio.dataset.loaded = "unknown";

  audio.addEventListener("canplaythrough", () => {
    audio.dataset.loaded = "ready";
  });

  audio.addEventListener("error", () => {
    audio.dataset.loaded = "error";
  });

  return audio;
}

function stopSpriteAudio(audio) {
  audio.pause();

  try {
    audio.currentTime = 0;
  } catch {
    return;
  }

  if (audio.dataset.stopTimer) {
    window.clearTimeout(Number(audio.dataset.stopTimer));
    audio.dataset.stopTimer = "";
  }
}

function playSpriteSound(name) {
  const sprite = sfxSpriteMap[name];
  const audio = sounds.sprite;

  if (!sprite || !audio || audio.dataset.loaded === "error") {
    return;
  }

  stopSpriteAudio(audio);
  audio.volume = sprite.volume;

  try {
    audio.currentTime = sprite.start;
  } catch {
    return;
  }

  const playPromise = audio.play();

  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {});
  }

  const stopTimer = window.setTimeout(() => {
    audio.pause();
  }, sprite.duration * 1000);

  audio.dataset.stopTimer = String(stopTimer);
}

function markAudioEnabled() {
  audioState.enabled = true;
}

function showSoundModal() {
  soundModalEl.hidden = false;
}

function hideSoundModal() {
  soundModalEl.hidden = true;
}

function updateSoundButtons() {
  soundButtons.forEach((button) => {
    const isOn = button.dataset.sound === "on";
    button.classList.toggle("is-active", game.soundEnabled === isOn);
    button.textContent = isOn ? t("sound_on") : t("sound_off");
  });
}

function setSoundEnabled(enabled) {
  game.soundEnabled = enabled;

  if (!enabled) {
    pauseBgm();
  } else if (game.state === "playing") {
    markAudioEnabled();
    resumeBgm();
  }

  updateSoundButtons();
}

function confirmSoundChoice(enabled) {
  game.soundChoiceDone = true;
  setSoundEnabled(enabled);

  if (enabled) {
    markAudioEnabled();
  }

  hideSoundModal();
}

function playSound(name) {
  if (!audioState.enabled || !game.soundEnabled) {
    return;
  }

  playSpriteSound(name);
}

function playBgm() {
  if (!audioState.enabled || !game.soundEnabled) {
    return;
  }

  const bgm = sounds.bgm;

  if (!bgm || bgm.dataset.loaded === "error") {
    return;
  }

  const playPromise = bgm.play();

  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {});
  }
}

function stopBgm() {
  const bgm = sounds.bgm;

  if (!bgm) {
    return;
  }

  bgm.pause();

  try {
    bgm.currentTime = 0;
  } catch {
    return;
  }
}

function pauseBgm() {
  const bgm = sounds.bgm;

  if (!bgm) {
    return;
  }

  bgm.pause();
}

function resumeBgm() {
  if (!audioState.enabled || !game.soundEnabled) {
    return;
  }

  const bgm = sounds.bgm;

  if (!bgm || bgm.dataset.loaded === "error") {
    return;
  }

  const playPromise = bgm.play();

  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {});
  }
}

function maybePlayAlert() {
  if (!audioState.enabled || !game.soundEnabled || smoke.active) {
    return;
  }

  if (game.exposure < 72) {
    return;
  }

  if (game.time - audioState.lastAlertAt < 1.1) {
    return;
  }

  audioState.lastAlertAt = game.time;
  playSound("alert");
}

function t(key, params = {}) {
  const table = locales[game.locale];
  let text = table[key] ?? "";

  Object.entries(params).forEach(([name, value]) => {
    text = text.replace(`{${name}}`, value);
  });

  return text;
}

function formatScore(value) {
  const score = value.toFixed(1);
  return `${score} ${t("score_unit")}`;
}

function buildShareText() {
  return `『影もぐり』v${GAME_VERSION} ${t("share_text", {
    score: formatScore(game.score),
  })}`;
}

function buildSharePayload() {
  const shareText = `${buildShareText()}\n${window.location.href}`;
  const xText = `${buildShareText()}\n#影もぐり @TasukuTSUKIOKA`;

  return {
    text: shareText,
    xText,
    url: window.location.href,
  };
}

function buildXShareUrl() {
  const url = new URL("https://twitter.com/intent/tweet");
  url.searchParams.set("text", `${buildShareText()}\n#影もぐり @TasukuTSUKIOKA`);
  url.searchParams.set("url", window.location.href);
  return url.toString();
}
function openXShare(event) {
  if (event) {
    event.preventDefault();
  }

  window.location.assign(buildXShareUrl());
}

function setShareFeedback(text = "") {
  if (!shareFeedback) {
    return;
  }

  shareFeedback.textContent = text;
  shareFeedback.hidden = !text;
}

function updateSharePanel() {
  if (!sharePanel || !sharePreview || !shareXButton || !shareCopyButton) {
    return;
  }

  const isGameOver = game.state === "gameover";
  sharePanel.hidden = !isGameOver;

  if (!isGameOver) {
    sharePreview.textContent = "";
    setShareFeedback();
    shareXButton.href = "https://twitter.com/intent/tweet";
    return;
  }

  const payload = buildSharePayload();
  sharePreview.textContent = payload.text;
  setShareFeedback();
  shareXButton.textContent = t("share_x");
  shareCopyButton.textContent = t("share_copy");

  shareXButton.href = buildXShareUrl();
}

async function handleCopyShare() {
  if (game.state !== "gameover") {
    return;
  }

  const payload = buildSharePayload();
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(payload.text);
      const copiedText = t("share_copied");
      smokeStatusEl.textContent = copiedText;
      setShareFeedback(copiedText);
      return;
    } catch {}
  }

  window.prompt("Copy this text", payload.text);
}

function setLocale(locale) {
  game.locale = locale;
  document.documentElement.lang = locale;
  document.title = t("page_title");

  i18nNodes.forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  localeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.locale === locale);
  });

  updateSoundButtons();
  syncMessageByState();
  updateHud();
  updateSharePanel();
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function randomDirection() {
  return Math.random() < 0.5 ? -1 : 1;
}

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createLight(
  x,
  y,
  spread,
  speed,
  direction,
  baseSpeed = speed,
  speedVariance = 0,
  speedChangeInterval = randomBetween(5, 10),
  nextSpeedChangeAt = speedChangeInterval,
  speedOffset = 0,
  targetSpeedOffset = speedOffset
) {
  return {
    x,
    y,
    spread,
    speed,
    direction,
    baseSpeed,
    speedVariance,
    speedChangeInterval,
    nextSpeedChangeAt,
    speedOffset,
    targetSpeedOffset,
    feintTimer: 0,
    feintSlowMultiplier: 1,
    lastPlayerDeltaX: 0,
    passPenaltyCooldown: 0,
  };
}

function createSpawnedLight(config) {
  const direction =
    typeof config.direction === "function" ? config.direction() : config.direction;
  const speedChangeInterval = randomBetween(5, 10);
  const speedOffset = randomBetween(-config.speedVariance, config.speedVariance);

  return createLight(
    randomBetween(config.minX, config.maxX),
    config.y,
    config.spread,
    config.baseSpeed + speedOffset,
    direction,
    config.baseSpeed,
    config.speedVariance,
    speedChangeInterval,
    speedChangeInterval,
    speedOffset,
    speedOffset
  );
}

function resetLights() {
  lights.length = 0;
  lights.push(createSpawnedLight(randomChoice(lightSpawnConfigs.opening)));
}

function getTitleByLevel(level) {
  const threshold = titleThresholds.find((entry) => entry.level === level);

  if (!threshold) {
    return t("title_rank_none");
  }

  return game.locale === "ja" ? threshold.titleJa : threshold.titleEn;
}

function getReachedLevel(seconds) {
  let level = 0;

  titleThresholds.forEach((threshold) => {
    if (seconds >= threshold.seconds) {
      level = threshold.level;
    }
  });

  return level;
}

function getTierByLevel(level) {
  const safeLevel = clamp(level || 1, 1, TITLE_LEVEL_MAX);
  return difficultyTiers[safeLevel - 1];
}

function getTierByTime(seconds) {
  return getTierByLevel(Math.max(1, getReachedLevel(seconds)));
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || "{}");
    game.progress.bestTime = Math.max(0, Number(saved.bestTime) || 0);
    game.progress.unlockedLevel = clamp(
      Math.floor(Number(saved.unlockedLevel) || 0),
      0,
      TITLE_LEVEL_MAX
    );
  } catch {
    game.progress.bestTime = 0;
    game.progress.unlockedLevel = 0;
  }
}

function saveProgress() {
  localStorage.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify({
      bestTime: game.progress.bestTime,
      unlockedLevel: game.progress.unlockedLevel,
    })
  );
}

function syncLightsWithTier(tier) {
  const spawnGroups = [
    lightSpawnConfigs.opening,
    lightSpawnConfigs.second,
    lightSpawnConfigs.third,
    lightSpawnConfigs.third,
  ];

  while (lights.length < tier.lightCount) {
    const group = spawnGroups[Math.min(lights.length, spawnGroups.length - 1)];
    lights.push(createSpawnedLight(randomChoice(group)));
  }

  while (lights.length > tier.lightCount) {
    lights.pop();
  }
}

function applyDifficultyTier(seconds = game.time) {
  const tier = getTierByTime(seconds);
  game.difficultyLevel = tier.level;
  game.currentTier = tier;
  camp.triggerTime = tier.campTriggerTime;
  camp.driftSpeed = tier.campDriftSpeed;
  camp.slowSpeed = tier.campSlowSpeed;
  syncLightsWithTier(tier);
}

function maybeTriggerFeint(light, tier, playerCenterX) {
  if (light.feintTimer > 0 || game.time < 8 || tier.feintChance <= 0) {
    return;
  }

  const deltaX = playerCenterX - light.x;
  const towardPlayer = Math.sign(deltaX) === light.direction;
  const nearCrossing = Math.abs(deltaX) <= 120;

  if (!towardPlayer || !nearCrossing) {
    return;
  }

  if (Math.random() >= tier.feintChance) {
    return;
  }

  light.feintTimer = randomBetween(0.3, 0.7);
  light.feintSlowMultiplier = randomBetween(0.45, 0.7);
}

function triggerPassPenalty() {
  const damage = player.speedPenaltyTimer > 0 ? 4 : 12;

  player.speedPenaltyTimer = 0.9;
  player.speedPenaltyMultiplier = 0.6;
  game.exposure = clamp(game.exposure + damage, 0, game.maxExposure);
}

function updatePlayerPenalty(deltaTime) {
  if (player.speedPenaltyTimer > 0) {
    player.speedPenaltyTimer = Math.max(0, player.speedPenaltyTimer - deltaTime);
  }

  if (player.speedPenaltyTimer <= 0) {
    player.speedPenaltyMultiplier = 1;
  }
}

function maybeTriggerPassPenalty(light, playerCenterX, deltaTime) {
  if (light.passPenaltyCooldown > 0) {
    light.passPenaltyCooldown = Math.max(0, light.passPenaltyCooldown - deltaTime);
  }

  const deltaX = playerCenterX - light.x;
  const previousDeltaX = light.lastPlayerDeltaX;
  const wasApproaching = Math.sign(previousDeltaX) === light.direction;
  const crossed = previousDeltaX !== 0 && Math.sign(previousDeltaX) !== Math.sign(deltaX);
  const nearLight = Math.abs(deltaX) <= 54 || Math.abs(previousDeltaX) <= 54;

  if (wasApproaching && crossed && nearLight && light.passPenaltyCooldown <= 0) {
    triggerPassPenalty();
    light.passPenaltyCooldown = 0.75;
  }

  light.lastPlayerDeltaX = deltaX;
}

function resolveProgress() {
  const reachedLevel = getReachedLevel(game.score);
  const newTitles = [];

  if (game.score > game.progress.bestTime) {
    game.progress.bestTime = game.score;
  }

  for (let level = game.progress.unlockedLevel + 1; level <= reachedLevel; level += 1) {
    newTitles.push(getTitleByLevel(level));
  }

  game.progress.unlockedLevel = Math.max(game.progress.unlockedLevel, reachedLevel);
  game.latestUnlockedTitles = newTitles;
  saveProgress();
}

function buildGameOverMessage() {
  const reachedLevel = getReachedLevel(game.score);
  const highestLevel = Math.max(reachedLevel, game.progress.unlockedLevel);
  const lines = [`${t("result_survived")} ${formatScore(game.score)}`];

  if (game.latestUnlockedTitles.length > 0) {
    lines.push(
      t("result_new_title", {
        title: game.latestUnlockedTitles.join(" / "),
      })
    );
  } else {
    lines.push(
      t("result_current_title", {
        title: highestLevel > 0 ? getTitleByLevel(highestLevel) : t("title_rank_none"),
      })
    );
  }

  const nextThreshold = titleThresholds.find((entry) => entry.level === highestLevel + 1);

  if (nextThreshold) {
    lines.push(
      t("result_next_title", {
        title: getTitleByLevel(nextThreshold.level),
        seconds: formatScore(Math.max(0, nextThreshold.seconds - game.score)),
      })
    );
  } else {
    lines.push(t("result_legend_cleared"));
  }

  lines.push(t("message_gameover_retry"));
  return lines.join(" / ");
}

function resetSmoke() {
  smoke.active = false;
  smoke.activeTime = 0;
  smoke.charges = smoke.maxCharges;
  smoke.rechargeTimer = 0;
}

function resetPlayerPenalty() {
  player.speedPenaltyTimer = 0;
  player.speedPenaltyMultiplier = 1;
}

function resetCamp() {
  camp.anchorX = player.x + player.width / 2;
  camp.stillTime = 0;
  camp.targetLightIndex = -1;
  camp.triggerTime = defaultCampValues.triggerTime;
  camp.driftSpeed = defaultCampValues.driftSpeed;
  camp.slowSpeed = defaultCampValues.slowSpeed;
}

function resetGame() {
  game.state = "idle";
  game.time = 0;
  game.exposure = 0;
  game.score = 0;
  game.gameOverFade = 0;
  audioState.lastAlertAt = 0;
  game.difficultyLevel = 1;
  game.currentTier = difficultyTiers[0];
  game.latestUnlockedTitles = [];

  player.x = canvas.width / 2 - player.width / 2;
  resetPlayerPenalty();
  resetLights();
  resetSmoke();
  resetCamp();
  applyDifficultyTier(0);
  stopBgm();

  syncMessageByState();
  updateHud();
}

function startGame() {
  if (!game.soundChoiceDone) {
    showSoundModal();
    return;
  }

  if (game.soundEnabled) {
    markAudioEnabled();
  }

  game.state = "playing";
  game.time = 0;
  game.exposure = 0;
  game.score = 0;
  game.gameOverFade = 0;
  audioState.lastAlertAt = 0;
  game.difficultyLevel = 1;
  game.currentTier = difficultyTiers[0];
  game.latestUnlockedTitles = [];

  player.x = canvas.width / 2 - player.width / 2;
  resetPlayerPenalty();
  resetLights();
  resetSmoke();
  resetCamp();
  applyDifficultyTier(0);

  hideMessage();
  updateHud();
  playSound("start");
  playBgm();
}

function pauseGame() {
  if (game.state !== "playing") {
    return;
  }

  game.state = "paused";
  pauseBgm();
  syncMessageByState();
  updateHud();
}

function resumeGame() {
  if (game.state !== "paused") {
    return;
  }

  if (game.soundEnabled) {
    markAudioEnabled();
  }

  game.state = "playing";
  hideMessage();
  updateHud();
  resumeBgm();
}

function endGame() {
  resolveProgress();
  game.state = "gameover";
  pauseBgm();
  syncMessageByState();
  updateHud();
  playSound("gameover");
}

function syncMessageByState() {
  if (game.state === "idle") {
    setMessage(t("message_idle_title"), t("message_idle_text"));
    return;
  }

  if (game.state === "paused") {
    setMessage(t("message_paused_title"), t("message_paused_text"));
    return;
  }

  if (game.state === "gameover") {
    setMessage(
      t("message_gameover_title"),
      buildGameOverMessage()
    );
  }
}

function setMessage(title, text) {
  messageTitleEl.textContent = title;
  messageTextEl.textContent = text;
  messageEl.hidden = false;
}

function hideMessage() {
  messageEl.hidden = true;
}

function updateToggleButton() {
  if (!toggleButton) {
    return;
  }

  if (game.state === "idle") {
    toggleButton.textContent = t("toggle_idle");
    return;
  }

  if (game.state === "playing") {
    toggleButton.textContent = t("toggle_playing");
    return;
  }

  if (game.state === "paused") {
    toggleButton.textContent = t("toggle_paused");
    return;
  }

  toggleButton.textContent = t("toggle_gameover");
}

function updateHud() {
  const chargeText = `${smoke.charges}/${smoke.maxCharges}`;
  const smokeLabel = smoke.active
    ? t("smoke_active", {
        time: smoke.activeTime.toFixed(1),
        charges: chargeText,
      })
    : smoke.charges < smoke.maxCharges
      ? t("smoke_cooldown", {
          time: smoke.rechargeTimer.toFixed(1),
          charges: chargeText,
        })
      : t("smoke_ready", { charges: chargeText });
  const canUseSmoke = !smoke.active && smoke.charges > 0;
  const smokeButtonLabel = canUseSmoke
    ? t("smoke_button_ready", { charges: chargeText })
    : t("smoke_button_waiting", { charges: chargeText });

  scoreEl.textContent = formatScore(game.score);
  smokeStatusEl.textContent = smokeLabel;
  exposureFillEl.style.width = `${(game.exposure / game.maxExposure) * 100}%`;
  if (smokeButton) {
    smokeButton.textContent = smokeButtonLabel;
    smokeButton.classList.toggle("is-ready", canUseSmoke);
  }
  updateToggleButton();
  updateSharePanel();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getBeamHalfWidth(light, y) {
  const depth = Math.max(y - light.y, 0);
  return 18 + depth * 0.2 + light.spread;
}

function isPlayerInLightForLight(light) {
  const playerCenterX = player.x + player.width / 2;
  const playerTop = player.y;
  const playerBottom = player.y + player.height;

  if (playerBottom <= light.y) {
    return false;
  }

  const sampleY = (playerTop + playerBottom) / 2;
  const beamHalfWidth = getBeamHalfWidth(light, sampleY);

  return Math.abs(playerCenterX - light.x) <= beamHalfWidth;
}

function isPlayerInLight() {
  return lights.some((light) => isPlayerInLightForLight(light));
}

function getLightHitCount() {
  return lights.filter((light) => isPlayerInLightForLight(light)).length;
}

function isPlayerBehindPillar(light) {
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  if (playerCenterY <= light.y) {
    return false;
  }

  return pillars.some((pillar) => {
    const pillarCenterX = pillar.x + pillar.width / 2;
    const lightSide = playerCenterX - light.x;
    const pillarSide = pillarCenterX - light.x;

    if (lightSide === 0) {
      return Math.abs(playerCenterX - pillarCenterX) < pillar.width / 2;
    }

    if (lightSide * pillarSide <= 0) {
      return false;
    }

    if (Math.abs(pillarCenterX - light.x) >= Math.abs(playerCenterX - light.x)) {
      return false;
    }

    const tLine = (pillar.top - light.y) / (playerCenterY - light.y);
    const shadowX = light.x + (playerCenterX - light.x) * tLine;

    return shadowX >= pillar.x && shadowX <= pillar.x + pillar.width;
  });
}

function isPlayerHidden() {
  return lights.some((light) => {
    return isPlayerInLightForLight(light) && isPlayerBehindPillar(light);
  });
}

function useSmoke() {
  if (game.state !== "playing") {
    return;
  }

  if (smoke.active || smoke.charges <= 0) {
    return;
  }

  if (game.soundEnabled) {
    markAudioEnabled();
  }

  smoke.active = true;
  smoke.activeTime = smoke.duration;
  smoke.charges -= 1;

  if (smoke.charges < smoke.maxCharges && smoke.rechargeTimer <= 0) {
    smoke.rechargeTimer = smoke.cooldown;
  }
  updateHud();
  playSound("smoke");
}

function getPlayerCenterX() {
  return player.x + player.width / 2;
}

function updateCamp(deltaTime) {
  const playerCenterX = getPlayerCenterX();
  const movedDistance = Math.abs(playerCenterX - camp.anchorX);

  if (movedDistance >= camp.releaseDistance) {
    camp.anchorX = playerCenterX;
    camp.stillTime = 0;
    camp.targetLightIndex = -1;
    return;
  }

  camp.stillTime += deltaTime;

  if (camp.stillTime < camp.triggerTime || lights.length === 0) {
    camp.targetLightIndex = -1;
    return;
  }

  let nearestIndex = 0;
  let nearestDistance = Infinity;

  lights.forEach((light, index) => {
    const distance = Math.abs(light.x - playerCenterX);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  camp.targetLightIndex = nearestIndex;
}

function updateLights(deltaTime) {
  const playerCenterX = getPlayerCenterX();
  const tier = game.currentTier;

  lights.forEach((light, index) => {
    const variance = light.speedVariance * tier.speedVarianceMultiplier;
    const baseSpeed = (light.baseSpeed + index * 24) * tier.speedMultiplier;

    if (game.time >= light.nextSpeedChangeAt) {
      light.speedChangeInterval = randomBetween(5, 10);
      light.nextSpeedChangeAt = game.time + light.speedChangeInterval;
      light.targetSpeedOffset = randomBetween(-variance, variance);
    }

    const speedStep = 20 * deltaTime;
    const offsetDelta = light.targetSpeedOffset - light.speedOffset;

    if (Math.abs(offsetDelta) <= speedStep) {
      light.speedOffset = light.targetSpeedOffset;
    } else {
      light.speedOffset += Math.sign(offsetDelta) * speedStep;
    }

    maybeTriggerFeint(light, tier, playerCenterX);
    maybeTriggerPassPenalty(light, playerCenterX, deltaTime);

    if (light.feintTimer > 0) {
      light.feintTimer = Math.max(0, light.feintTimer - deltaTime);
    } else {
      light.feintSlowMultiplier = 1;
    }

    light.speed = (baseSpeed + light.speedOffset) * light.feintSlowMultiplier;

    if (index === camp.targetLightIndex) {
      const deltaX = playerCenterX - light.x;
      const drift = clamp(deltaX, -camp.driftSpeed, camp.driftSpeed);
      light.x += drift * deltaTime;

      const direction = Math.sign(deltaX) || light.direction;
      light.direction = direction;
      light.speed = Math.min(light.speed, camp.slowSpeed);
    }

    light.x += light.speed * light.direction * deltaTime;

    const leftEdge = 40;
    const rightEdge = canvas.width - 40;

    if (light.x <= leftEdge) {
      light.x = leftEdge;
      light.direction = 1;
    }

    if (light.x >= rightEdge) {
      light.x = rightEdge;
      light.direction = -1;
    }
  });
}

function updateSmoke(deltaTime) {
  if (smoke.active) {
    smoke.activeTime -= deltaTime;

    if (smoke.activeTime <= 0) {
      smoke.active = false;
      smoke.activeTime = 0;
    }
  }

  if (smoke.charges >= smoke.maxCharges) {
    smoke.rechargeTimer = 0;
    return;
  }

  smoke.rechargeTimer -= deltaTime;

  if (smoke.rechargeTimer <= 0) {
    smoke.charges = Math.min(smoke.maxCharges, smoke.charges + 1);
    smoke.rechargeTimer =
      smoke.charges < smoke.maxCharges ? smoke.cooldown : 0;
  }
}

function updatePlayer(deltaTime) {
  let move = 0;

  if (keys.left) {
    move -= 1;
  }

  if (keys.right) {
    move += 1;
  }

  updatePlayerPenalty(deltaTime);
  player.x += move * player.speed * player.speedPenaltyMultiplier * deltaTime;
  player.x = clamp(player.x, 24, canvas.width - player.width - 24);
}

function updateExposure(deltaTime) {
  const hitCount = getLightHitCount();
  const inLight = hitCount > 0;
  const hidden = inLight && isPlayerHidden();

  let recovery = 15;

  if (hidden) {
    recovery = 36;

    if (game.exposure >= 60) {
      recovery = 44;
    }
  }

  if (smoke.active) {
    game.exposure -= 52 * deltaTime;
  } else if (inLight && !hidden) {
    const exposureRate = 30 + Math.max(0, hitCount - 1) * 12;
    game.exposure += exposureRate * deltaTime;
  } else {
    game.exposure -= recovery * deltaTime;
  }

  game.exposure = clamp(game.exposure, 0, game.maxExposure);

  if (game.exposure >= game.maxExposure) {
    endGame();
  }
}

function update(deltaTime) {
  if (game.state === "gameover") {
    game.gameOverFade = clamp(game.gameOverFade + deltaTime * 1.8, 0, 1);
    return;
  }

  if (game.state !== "playing") {
    return;
  }

  game.time += deltaTime;
  game.score = game.time;
  applyDifficultyTier(game.time);

  updatePlayer(deltaTime);
  updateCamp(deltaTime);
  updateLights(deltaTime);
  updateSmoke(deltaTime);
  updateExposure(deltaTime);
  maybePlayAlert();
  updateHud();
}

function drawBackground() {
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#101010";
  ctx.fillRect(0, canvas.height - 84, canvas.width, 84);
}

function drawPillars() {
  pillars.forEach((pillar) => {
    ctx.fillStyle = "#161616";
    ctx.fillRect(pillar.x, pillar.top, pillar.width, canvas.height - pillar.top);

    ctx.fillStyle = "#2d2d2d";
    ctx.fillRect(pillar.x + pillar.width - 8, pillar.top, 8, canvas.height - pillar.top);
  });
}

function drawLight(light) {
  const bottomY = canvas.height;
  const halfWidth = getBeamHalfWidth(light, bottomY);
  const gradient = ctx.createLinearGradient(light.x, light.y, light.x, bottomY);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.36)");
  gradient.addColorStop(0.35, "rgba(255, 255, 255, 0.18)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0.02)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(light.x - 14, light.y);
  ctx.lineTo(light.x + 14, light.y);
  ctx.lineTo(light.x + halfWidth, bottomY);
  ctx.lineTo(light.x - halfWidth, bottomY);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(light.x, light.y, 10, 0, Math.PI * 2);
  ctx.stroke();
}

function drawLights() {
  lights.forEach((light) => {
    drawLight(light);
  });
}

function drawShadowHints() {
  ctx.save();
  ctx.filter = "blur(10px)";

  lights.forEach((light) => {
    pillars.forEach((pillar) => {
      const leftX = pillar.x;
      const rightX = pillar.x + pillar.width;
      const bottomY = canvas.height;
      const extend = 9;
      const maxOffset = 260;
      const rawShadowLeftX = leftX + (leftX - light.x) * extend;
      const rawShadowRightX = rightX + (rightX - light.x) * extend;
      const shadowLeftX = leftX + clamp(rawShadowLeftX - leftX, -maxOffset, maxOffset);
      const shadowRightX = rightX + clamp(rawShadowRightX - rightX, -maxOffset, maxOffset);

      ctx.fillStyle = "rgba(0, 0, 0, 0.68)";
      ctx.beginPath();
      ctx.moveTo(leftX, pillar.top);
      ctx.lineTo(rightX, pillar.top);
      ctx.lineTo(shadowRightX, bottomY);
      ctx.lineTo(shadowLeftX, bottomY);
      ctx.closePath();
      ctx.fill();
    });
  });

  ctx.restore();
}

function drawSmoke() {
  if (!smoke.active) {
    return;
  }

  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;

  for (let i = 0; i < 6; i += 1) {
    const offsetX = (i - 2.5) * 12;
    const offsetY = (i % 2 === 0 ? -10 : 8) + i * 2;
    const radius = 18 + i * 3;

    ctx.fillStyle = "rgba(230, 230, 230, 0.18)";
    ctx.beginPath();
    ctx.arc(centerX + offsetX, centerY + offsetY, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlayer() {
  const inLight = isPlayerInLight();
  const hidden = inLight && isPlayerHidden();

  ctx.fillStyle = hidden ? "#6f6f6f" : inLight ? "#f1f1f1" : "#c8c8c8";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  if (hidden) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - game.gameOverFade * 0.8})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x - 2, player.y - 2, player.width + 4, player.height + 4);
  }

  ctx.fillStyle = "#000000";
  ctx.fillRect(player.x + 8, player.y + 10, 6, 6);
  ctx.fillRect(player.x + 20, player.y + 10, 6, 6);
}

function drawGameOverOverlay() {
  if (game.gameOverFade <= 0) {
    return;
  }

  ctx.fillStyle = `rgba(0, 0, 0, ${game.gameOverFade * 0.45})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = `rgba(255, 255, 255, ${0.22 - game.gameOverFade * 0.12})`;
  ctx.lineWidth = 6;
  ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);
}

function draw() {
  drawBackground();
  drawLights();
  drawShadowHints();
  drawPillars();
  drawSmoke();
  drawPlayer();
  drawGameOverOverlay();
}

function handleToggleAction() {
  if (!game.soundChoiceDone) {
    showSoundModal();
    return;
  }

  if (game.state === "idle" || game.state === "gameover") {
    startGame();
    return;
  }

  if (game.state === "playing") {
    pauseGame();
    return;
  }

  if (game.state === "paused") {
    resumeGame();
  }
}

let lastTime = 0;

function loop(timestamp) {
  const deltaTime = Math.min((timestamp - lastTime) / 1000, 0.033);
  lastTime = timestamp;

  update(deltaTime);
  draw();

  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (!game.soundChoiceDone && event.code === "Space") {
    event.preventDefault();
    showSoundModal();
    return;
  }

  if (event.code === "ArrowLeft" || event.code === "KeyA") {
    keys.left = true;
  }

  if (event.code === "ArrowRight" || event.code === "KeyD") {
    keys.right = true;
  }

  if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
    event.preventDefault();
    useSmoke();
  }

  if (event.code === "Space") {
    event.preventDefault();
    handleToggleAction();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft" || event.code === "KeyA") {
    keys.left = false;
  }

  if (event.code === "ArrowRight" || event.code === "KeyD") {
    keys.right = false;
  }
});

controlButtons.forEach((button) => {
  const control = button.dataset.control;

  const press = (event) => {
    event.preventDefault();

    if (!game.soundChoiceDone) {
      showSoundModal();
      return;
    }

    if (game.soundEnabled) {
      markAudioEnabled();
    }

    if (control === "left") {
      keys.left = true;
    }

    if (control === "right") {
      keys.right = true;
    }
  };

  const release = (event) => {
    event.preventDefault();

    if (control === "left") {
      keys.left = false;
    }

    if (control === "right") {
      keys.right = false;
    }
  };

  if (control === "left" || control === "right") {
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointerleave", release);
    button.addEventListener("pointercancel", release);
  }

  if (control === "smoke") {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      useSmoke();
    });
  }

  if (control === "toggle") {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      handleToggleAction();
    });
  }
});

localeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLocale(button.dataset.locale);
  });
});

soundButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const enabled = button.dataset.sound === "on";
    setSoundEnabled(enabled);
  });
});

soundChoiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const enabled = button.dataset.soundChoice === "on";
    confirmSoundChoice(enabled);
  });
});

if (shareCopyButton) {
  shareCopyButton.addEventListener("click", () => {
    handleCopyShare();
  });
}

if (shareXButton) {
  shareXButton.addEventListener("click", (event) => {
    openXShare(event);
  });
}

[
  ...controlButtons,
  ...localeButtons,
  ...soundButtons,
  ...soundChoiceButtons,
  shareCopyButton,
  shareXButton,
]
  .filter(Boolean)
  .forEach((element) => {
    element.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  });

resetGame();
loadProgress();
setLocale("ja");
setSoundEnabled(true);
showSoundModal();
requestAnimationFrame(loop);

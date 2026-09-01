// ========================================
// HSR Damage Calculator - Calculation Core
// ========================================

const $ = id => document.getElementById(id);

const n = id => {
  const el = $(id);
  if (!el) return 0;
  return Number(el.value) || 0;
};

const p = id => n(id) / 100;


// ========================================
// 初期化
// ========================================

function init() {

  const characterSelect = $('characterSelect');

  Object.entries(HSR_DATA.characters).forEach(([id, character]) => {

    const option = document.createElement('option');

    option.value = id;
    option.textContent = character.name;

    characterSelect.appendChild(option);

  });


  const lightConeSelect = $('lightConeSelect');

  Object.entries(HSR_DATA.lightCones).forEach(([id, cone]) => {

    const option = document.createElement('option');

    option.value = id;
    option.textContent = cone.name;

    lightConeSelect.appendChild(option);

  });


  characterSelect.addEventListener('change', loadCharacter);

  lightConeSelect.addEventListener('change', calculate);


  document
    .querySelectorAll('input, select')
    .forEach(element => {

      element.addEventListener('input', calculate);
      element.addEventListener('change', calculate);

    });


  $('saveBtn').onclick = saveSettings;

  $('loadBtn').onclick = loadSettings;

  $('resetBtn').onclick = () => location.reload();


  loadCharacter();

}


// ========================================
// キャラクター読み込み
// ========================================

function loadCharacter() {

  const characterId = $('characterSelect').value;

  const character = HSR_DATA.characters[characterId];

  if (!character) return;


  // 基礎ステータス

  $('charLevel').value = character.level;

  $('atk').value = character.baseStats.atk;

  $('critRate').value = character.stats.critRate;

  $('critDmg').value = character.stats.critDmg;

  $('speed').value = character.baseStats.speed;

  $('elementDmg').value = character.stats.elementDmg;


  // キャラクター表示

  $('partyMain').textContent = character.name;

  $('resultCharacter').textContent = character.name;

  $('resultElement').textContent = character.element;


  // 攻撃一覧

  const attackSelect = $('attackSelect');

  attackSelect.innerHTML = '';


  Object.entries(character.attacks).forEach(([id, attack]) => {

    const option = document.createElement('option');

    option.value = id;

    option.textContent = attack.name;

    attackSelect.appendChild(option);

  });


  attackSelect.onchange = loadAttack;

  loadAttack();

}


// ========================================
// 攻撃読み込み
// ========================================

function loadAttack() {

  const character =
    HSR_DATA.characters[$('characterSelect').value];

  if (!character) return;


  const attack =
    character.attacks[$('attackSelect').value];

  if (!attack) return;


  $('multiplier').value = attack.multiplier;

  calculate();

}


// ========================================
// 攻撃力計算
// ========================================

function calculateAttackPower() {

  const baseAtk = n('atk');

  const relicAtk = p('relicAtk');

  const buffAtk = p('buffAtk');


  return baseAtk * (1 + relicAtk + buffAtk);

}


// ========================================
// 会心係数
// ========================================

function calculateCritMultiplier() {

  const critRate =
    Math.min(
      1,
      p('critRate') + p('buffCrit')
    );


  const critDamage =
    p('critDmg') + p('buffCritDmg');


  const mode = $('critMode').value;


  // 会心

  if (mode === 'crit') {

    return 1 + critDamage;

  }


  // 非会心

  if (mode === 'noncrit') {

    return 1;

  }


  // 期待値

  if (mode === 'average') {

    return 1 + critRate * critDamage;

  }


  return 1;

}


// ========================================
// 与ダメージ係数
// ========================================

function calculateDamageMultiplier() {

  return 1
    + p('elementDmg')
    + p('buffDmg');

}


// ========================================
// 防御係数
// ========================================

function calculateDefenseMultiplier() {

  const enemyLevel = n('enemyLevel');

  const enemyDef = n('enemyDef');


  const defenseDown = p('defDown');

  const defenseIgnore = p('defIgnore');


  const effectiveDefense =
    Math.max(
      0,
      enemyDef *
      (1 - defenseDown) *
      (1 - defenseIgnore)
    );


  /*
   * 崩壊：スターレイルの基本防御係数
   *
   * 係数 =
   * (攻撃者Lv + 20)
   * /
   * ((攻撃者Lv + 20) + 敵防御力)
   *
   * 現段階では敵Lvを使用した簡易式。
   */

  const attackerLevel = n('charLevel');


  if (effectiveDefense <= 0) {
    return 1;
  }


  return (
    (attackerLevel + 20) /
    (
      attackerLevel +
      20 +
      effectiveDefense
    )
  );

}


// ========================================
// 耐性係数
// ========================================

function calculateResistanceMultiplier() {

  const resistance = p('resistance');


  return Math.max(
    0,
    1 - resistance
  );

}


// ========================================
// 被ダメージ係数
// ========================================

function calculateTakenMultiplier() {

  return 1 + p('takenUp');

}


// ========================================
// 弱点撃破係数
// ========================================

function calculateBrokenMultiplier() {

  const broken = $('broken').value;


  if (broken === '1') {
    return 1;
  }


  return 0.9;

}


// ========================================
// メイン計算
// ========================================

function calculate() {

  const character =
    HSR_DATA.characters[$('characterSelect').value];

  if (!character) return;


  const attack =
    character.attacks[$('attackSelect').value];

  if (!attack) return;


  // 攻撃力

  const atk =
    calculateAttackPower();


  // 倍率

  const multiplier =
    n('multiplier') / 100;


  // 固定加算

  const flatDamage =
    n('flatDamage');


  // 基礎ダメージ

  const baseDamage =
    atk * multiplier +
    flatDamage;


  // 各種係数

  const crit =
    calculateCritMultiplier();

  const damage =
    calculateDamageMultiplier();

  const defense =
    calculateDefenseMultiplier();

  const resistance =
    calculateResistanceMultiplier();

  const taken =
    calculateTakenMultiplier();

  const broken =
    calculateBrokenMultiplier();


  // 最終ダメージ

  const finalDamage =
    baseDamage *
    crit *
    damage *
    defense *
    resistance *
    taken *
    broken;


  // 表示

  $('damage').textContent =
    Math.floor(finalDamage)
      .toLocaleString('ja-JP');


  $('resultAttack').textContent =
    attack.name;


  $('qCrit').textContent =
    crit.toFixed(4);

  $('qDmg').textContent =
    damage.toFixed(4);

  $('qDef').textContent =
    defense.toFixed(4);

  $('qRes').textContent =
    resistance.toFixed(4);


  // 内訳

  const rows = [

    ['攻撃力', atk],

    ['倍率', multiplier * 100],

    ['基礎ダメージ', baseDamage],

    ['会心係数', crit],

    ['与ダメージ係数', damage],

    ['防御係数', defense],

    ['耐性係数', resistance],

    ['被ダメージ係数', taken],

    ['撃破係数', broken],

    ['最終ダメージ', finalDamage]

  ];


  $('breakdown').innerHTML =

    rows
      .map(([name, value]) => {

        const isMultiplier =
          name.includes('係数');

        const formatted =
          isMultiplier
            ? value.toFixed(4)
            : value.toLocaleString(
                'ja-JP',
                {
                  maximumFractionDigits: 2
                }
              );


        return `
          <div>
            <span>${name}</span>
            <b>${formatted}</b>
          </div>
        `;

      })
      .join('');

}


// ========================================
// 設定保存
// ========================================

function saveSettings() {

  const data = {};


  document
    .querySelectorAll('input, select')
    .forEach(element => {

      data[element.id] =
        element.type === 'checkbox'
          ? element.checked
          : element.value;

    });


  localStorage.setItem(
    'hsrCalc',
    JSON.stringify(data)
  );


  alert('設定を保存しました');

}


// ========================================
// 設定読み込み
// ========================================

function loadSettings() {

  const data =
    JSON.parse(
      localStorage.getItem('hsrCalc') || 'null'
    );


  if (!data) {

    alert('保存データがありません');

    return;

  }


  Object.entries(data)
    .forEach(([id, value]) => {

      const element = $(id);

      if (!element) return;


      if (element.type === 'checkbox') {

        element.checked = value;

      } else {

        element.value = value;

      }

    });


  calculate();

}


// ========================================
// 起動
// ========================================

init();

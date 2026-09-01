// ========================================
// HSR Damage Calculator - Calculation Core
// ========================================

const $ = id => document.getElementById(id);
const n = id => {
  const el = $(id);
  return el ? (Number(el.value) || 0) : 0;
};
const p = id => n(id) / 100;

function init() {
  const characterSelect = $('characterSelect');
  const lightConeSelect = $('lightConeSelect');

  // セレクトボックス初期化
  if (characterSelect) {
    characterSelect.innerHTML = '';
    Object.entries(HSR_DATA.characters).forEach(([id, character]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = character.name;
      characterSelect.appendChild(option);
    });
    characterSelect.addEventListener('change', loadCharacter);
  }

  if (lightConeSelect) {
    lightConeSelect.innerHTML = '';
    Object.entries(HSR_DATA.lightCones).forEach(([id, cone]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = cone.name;
      lightConeSelect.appendChild(option);
    });
    lightConeSelect.addEventListener('change', loadLightCone);
  }

  // レベル変更時に自動ステータス更新
  $('charLevel')?.addEventListener('change', updateCharacterStats);
  $('coneLevel')?.addEventListener('change', loadLightCone);
  $('coneSuper')?.addEventListener('change', loadLightCone);

  // 全要素入力イベント
  document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('input', calculate);
    element.addEventListener('change', calculate);
  });

  if ($('saveBtn')) $('saveBtn').onclick = saveSettings;
  if ($('loadBtn')) $('loadBtn').onclick = loadSettings;
  if ($('resetBtn')) $('resetBtn').onclick = () => location.reload();

  loadCharacter();
  loadLightCone();
}

// キャラクター選択時の自動セット
function loadCharacter() {
  const charId = $('characterSelect')?.value;
  const character = HSR_DATA.characters[charId];
  if (!character) return;

  // 表示の更新
  if ($('partyMain')) $('partyMain').textContent = character.name;
  if ($('resultCharacter')) $('resultCharacter').textContent = character.name;
  if ($('resultElement')) $('resultElement').textContent = character.element;

  // 1. 基礎ステータスの自動入力
  updateCharacterStats();

  // 2. 攻撃スキル一覧のロード
  const attackSelect = $('attackSelect');
  if (attackSelect) {
    attackSelect.innerHTML = '';
    Object.entries(character.attacks).forEach(([id, attack]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = attack.name;
      attackSelect.appendChild(option);
    });
    attackSelect.onchange = updateAttackMultiplier;
  }

  updateAttackMultiplier();
}

// レベル・軌跡に応じたステータスの動的更新
function updateCharacterStats() {
  const charId = $('characterSelect')?.value;
  const level = $('charLevel')?.value || 80;
  const character = HSR_DATA.characters[charId];
  if (!character) return;

  const baseStats = character.statsByLevel[level] || character.statsByLevel[80];
  const traceStats = character.traceStats || {};

  // ステータスフォームへの自動セット（基本値 + 軌跡ボーナス）
  if ($('atk')) $('atk').value = baseStats.atk;
  if ($('critRate')) $('critRate').value = 5.0 + (traceStats.critRate || 0); // 初期5% + 軌跡
  if ($('critDmg')) $('critDmg').value = 50.0 + (traceStats.critDmg || 0);  // 初期50% + 軌跡
  if ($('elementDmg')) $('elementDmg').value = traceStats.elementDmg || 0;
  if ($('speed')) $('speed').value = baseStats.speed;

  calculate();
}

// 攻撃スキルの倍率自動セット
function updateAttackMultiplier() {
  const charId = $('characterSelect')?.value;
  const attackId = $('attackSelect')?.value;
  const character = HSR_DATA.characters[charId];
  if (!character) return;

  const attack = character.attacks[attackId];
  if (!attack) return;

  // 軌跡Lv最大前提（通常:6, その他:10）
  const defaultTraceLevel = attack.type === 'basic' ? 6 : 10;
  const multiplier = attack.multipliers[defaultTraceLevel] || attack.multipliers[1] || 100;

  if ($('multiplier')) $('multiplier').value = multiplier;

  calculate();
}

// 光円錐の読み込みとバフ自動反映
function loadLightCone() {
  const coneId = $('lightConeSelect')?.value;
  const level = $('coneLevel')?.value || 80;
  const rank = $('coneSuper')?.value || 'S1';
  const cone = HSR_DATA.lightCones[coneId];

  if (!cone) return;

  // バフ自動設定（光円錐効果をバフ欄へ連動）
  const superBuffs = cone.superimposition?.[rank] || {};
  if ($('buffAtk')) $('buffAtk').value = superBuffs.atkPercent || 0;
  if ($('buffDmg')) $('buffDmg').value = superBuffs.damagePercent || 0;

  calculate();
}

// ========================================
// メインダメージ計算
// ========================================

function calculateAttackPower() {
  const characterAtk = n('atk');
  const lightConeId = $('lightConeSelect')?.value;
  const coneLevel = $('coneLevel')?.value || 80;
  const lightCone = HSR_DATA.lightCones[lightConeId];
  
  // 光円錐のレベル別基礎攻撃力取得
  const lightConeAtk = lightCone?.statsByLevel?.[coneLevel]?.atk || 0;

  const relicAtk = p('relicAtk');
  const buffAtk = p('buffAtk');
  const flatAtk = n('flatAtk');

  // 基礎攻撃力 ＝ キャラ基礎 + 光円錐基礎
  const baseAtk = characterAtk + lightConeAtk;
  return baseAtk * (1 + relicAtk + buffAtk) + flatAtk;
}

function calculate() {
  const charId = $('characterSelect')?.value;
  const attackId = $('attackSelect')?.value;
  const character = HSR_DATA?.characters?.[charId];
  if (!character) return;

  const atk = calculateAttackPower();
  const multiplier = n('multiplier') / 100;
  const flatDamage = n('flatDamage');
  
  const baseDamage = atk * multiplier + flatDamage;

  const critRate = Math.min(1, Math.max(0, p('critRate') + p('buffCrit')));
  const critDamage = p('critDmg') + p('buffCritDmg');
  const mode = $('critMode')?.value || 'average';

  let crit = 1 + (critRate * critDamage);
  if (mode === 'crit') crit = 1 + critDamage;
  if (mode === 'noncrit') crit = 1;

  const damage = 1 + p('elementDmg') + p('buffDmg');

  // 防御係数 (公式: (Lv+20) / ((Lv+20) + (敵Lv+20)*(1-防御無視/ダウン)))
  const attackerLevel = n('charLevel') || 80;
  const enemyLevel = n('enemyLevel') || 95;
  const defReduction = Math.min(1, p('defDown') + p('defIgnore'));
  const defense = (attackerLevel + 20) / ((attackerLevel + 20) + (enemyLevel + 20) * (1 - defReduction));

  // 耐性係数
  const resistance = Math.min(2.0, Math.max(0.2, 1 - (p('resistance') - p('resPen'))));
  const taken = 1 + p('takenUp');
  const broken = $('broken')?.value === '1' ? 1.0 : (Number($('broken')?.value) || 0.9);

  const finalDamage = baseDamage * crit * damage * defense * resistance * taken * broken;

  // UI描画
  if ($('damage')) $('damage').textContent = Math.floor(finalDamage).toLocaleString('ja-JP');
  if ($('resultAttack')) $('resultAttack').textContent = character.attacks[attackId]?.name || '-';

  if ($('qCrit')) $('qCrit').textContent = crit.toFixed(4);
  if ($('qDmg')) $('qDmg').textContent = damage.toFixed(4);
  if ($('qDef')) $('qDef').textContent = defense.toFixed(4);
  if ($('qRes')) $('qRes').textContent = resistance.toFixed(4);

  const breakdownEl = $('breakdown');
  if (breakdownEl) {
    const rows = [
      ['最終攻撃力', atk],
      ['スキル倍率 (%)', multiplier * 100],
      ['基礎ダメージ', baseDamage],
      ['会心係数', crit],
      ['与ダメージ係数', damage],
      ['防御係数', defense],
      ['耐性係数', resistance],
      ['最終ダメージ', finalDamage]
    ];

    breakdownEl.innerHTML = rows
      .map(([name, value]) => `
        <div>
          <span>${name}</span>
          <b>${name.includes('係数') ? value.toFixed(4) : value.toLocaleString('ja-JP', { maximumFractionDigits: 1 })}</b>
        </div>
      `)
      .join('');
  }
}

function saveSettings() {
  const data = {};
  document.querySelectorAll('input, select').forEach(el => {
    if (el.id) data[el.id] = el.type === 'checkbox' ? el.checked : el.value;
  });
  localStorage.setItem('hsrCalc', JSON.stringify(data));
  alert('設定を保存しました');
}

function loadSettings() {
  const rawData = localStorage.getItem('hsrCalc');
  if (!rawData) return;
  const data = JSON.parse(rawData);

  if (data.characterSelect) {
    $('characterSelect').value = data.characterSelect;
    loadCharacter();
  }

  Object.entries(data).forEach(([id, value]) => {
    const el = $(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = value;
    else el.value = value;
  });

  loadLightCone();
  calculate();
}

window.addEventListener('DOMContentLoaded', init);

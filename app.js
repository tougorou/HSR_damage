// ========================================
// HSR Damage Calculator - Calculation Core
// ========================================

const $ = id => document.getElementById(id);
const n = id => { const el = $(id); return el ? (Number(el.value) || 0) : 0; };
const p = id => n(id) / 100;

function init() {
  const characterSelect = $('characterSelect');
  const lightConeSelect = $('lightConeSelect');

  if (characterSelect && HSR_DATA.characters) {
    characterSelect.innerHTML = '';
    Object.entries(HSR_DATA.characters).forEach(([id, character]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = character.name;
      characterSelect.appendChild(option);
    });
    characterSelect.addEventListener('change', loadCharacter);
  }

  if (lightConeSelect && HSR_DATA.lightCones) {
    lightConeSelect.innerHTML = '';
    Object.entries(HSR_DATA.lightCones).forEach(([id, cone]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = cone.name;
      lightConeSelect.appendChild(option);
    });
    lightConeSelect.addEventListener('change', loadLightCone);
  }

  $('charLevel')?.addEventListener('change', updateCharacterStats);
  $('eidolonSelect')?.addEventListener('change', calculate);
  $('coneLevel')?.addEventListener('change', loadLightCone);
  $('coneSuper')?.addEventListener('change', loadLightCone);

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

// キャラクターロード
function loadCharacter() {
  const charId = $('characterSelect')?.value;
  const character = HSR_DATA?.characters?.[charId];
  if (!character) return;

  if ($('partyMain')) $('partyMain').textContent = character.name;
  if ($('resultCharacter')) $('resultCharacter').textContent = character.name;
  if ($('resultElement')) $('resultElement').textContent = character.element;

  renderEidolonOptions(character);
  renderSelfBuffs(character);

  const attackSelect = $('attackSelect');
  if (attackSelect && character.attacks) {
    attackSelect.innerHTML = '';
    Object.entries(character.attacks).forEach(([id, attack]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = attack.name;
      attackSelect.appendChild(option);
    });
    attackSelect.onchange = updateAttackMultiplier;
  }

  updateCharacterStats();
  updateAttackMultiplier();
}

// 星魂（凸）ドロップダウン生成
function renderEidolonOptions(character) {
  const eidolonSelect = $('eidolonSelect');
  if (!eidolonSelect) return;

  eidolonSelect.innerHTML = '';

  if (character.eidolons && Object.keys(character.eidolons).length > 0) {
    Object.entries(character.eidolons).forEach(([level, data]) => {
      const option = document.createElement('option');
      option.value = level;
      option.textContent = data.name || (level === '0' ? '無凸' : `${level}凸`);
      eidolonSelect.appendChild(option);
    });
  } else {
    for (let i = 0; i <= 6; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i === 0 ? '無凸' : `${i}凸`;
      eidolonSelect.appendChild(option);
    }
  }
}

// 自己バフUI動的描画
function renderSelfBuffs(character) {
  const container = $('selfBuffsContainer');
  if (!container) return;

  container.innerHTML = '';
  if (!character.selfBuffs) return;

  Object.entries(character.selfBuffs).forEach(([key, buff]) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `selfBuff_${key}`;
    checkbox.checked = true;
    checkbox.addEventListener('change', calculate);

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${buff.name}`));
    container.appendChild(label);
  });
}

// ステータス動的更新
function updateCharacterStats() {
  const charId = $('characterSelect')?.value;
  const level = $('charLevel')?.value || 80;
  const character = HSR_DATA?.characters?.[charId];
  if (!character) return;

  const baseStats = character.statsByLevel?.[level] || character.statsByLevel?.[80] || { atk: 0, speed: 100 };
  const traceStats = character.traceStats || {};

  if ($('atk')) $('atk').value = baseStats.atk || 0;
  if ($('critRate')) $('critRate').value = 5.0 + (traceStats.critRate || 0);
  if ($('critDmg')) $('critDmg').value = 50.0 + (traceStats.critDmg || 0);
  if ($('elementDmg')) $('elementDmg').value = traceStats.elementDmg || 0;

  calculate();
}

// スキル倍率更新
function updateAttackMultiplier() {
  const charId = $('characterSelect')?.value;
  const attackId = $('attackSelect')?.value;
  const character = HSR_DATA?.characters?.[charId];
  if (!character) return;

  const attack = character.attacks?.[attackId];
  if (!attack) return;

  const defaultTraceLevel = attack.type === 'basic' ? 6 : 10;
  const multiplier = attack.multipliers?.[defaultTraceLevel] || attack.multipliers?.[1] || 100;

  if ($('multiplier')) $('multiplier').value = multiplier;

  calculate();
}

// 光円錐ロード
function loadLightCone() {
  const coneId = $('lightConeSelect')?.value;
  const rank = $('coneSuper')?.value || 'S1';
  const cone = HSR_DATA?.lightCones?.[coneId];

  if (!cone) return;

  const superBuffs = cone.superimposition?.[rank] || {};
  if ($('buffAtk')) $('buffAtk').value = superBuffs.atkPercent || 0;
  if ($('buffDmg')) $('buffDmg').value = superBuffs.damagePercent || 0;
  if ($('buffCritDmg')) $('buffCritDmg').value = superBuffs.critDmg || 0;

  calculate();
}

// 自己バフ・星魂（凸）効果合算
function collectSelfAndEidolonBuffs(character) {
  const result = {
    atkPercent: 0,
    critRate: 0,
    critDmg: 0,
    damagePercent: 0,
    defIgnore: 0,
    resPen: 0
  };

  if (character.selfBuffs) {
    Object.entries(character.selfBuffs).forEach(([key, buff]) => {
      const cb = $(`selfBuff_${key}`);
      if (cb && cb.checked) {
        if (buff.atkPercent) result.atkPercent += buff.atkPercent;
        if (buff.critRate) result.critRate += buff.critRate;
        if (buff.critDmg) result.critDmg += buff.critDmg;
        if (buff.damagePercent) result.damagePercent += buff.damagePercent;
        if (buff.resPen) result.resPen += buff.resPen;
      }
    });
  }

  const eidolonLevel = Number($('eidolonSelect')?.value || 0);
  if (character.eidolons) {
    for (let i = 1; i <= eidolonLevel; i++) {
      const eData = character.eidolons[i];
      if (!eData) continue;
      if (eData.atkPercent) result.atkPercent += eData.atkPercent;
      if (eData.critRate) result.critRate += eData.critRate;
      if (eData.critDmg) result.critDmg += eData.critDmg;
      if (eData.damagePercent) result.damagePercent += eData.damagePercent;
      if (eData.defIgnore) result.defIgnore += eData.defIgnore;
      if (eData.resPen) result.resPen += eData.resPen;
    }
  }

  return result;
}

// 攻撃力計算
function calculateAttackPower(selfBuffs) {
  const characterAtk = n('atk');
  const lightConeId = $('lightConeSelect')?.value;
  const coneLevel = $('coneLevel')?.value || 80;
  const lightCone = HSR_DATA?.lightCones?.[lightConeId];
  
  const lightConeAtk = lightCone?.statsByLevel?.[coneLevel]?.atk || 0;

  const relicAtk = p('relicAtk');
  const buffAtk = p('buffAtk');
  const selfAtk = (selfBuffs.atkPercent || 0) / 100;
  const flatAtk = n('flatAtk');

  const baseAtk = characterAtk + lightConeAtk;
  return baseAtk * (1 + relicAtk + buffAtk + selfAtk) + flatAtk;
}

// メインダメージ計算
function calculate() {
  const charId = $('characterSelect')?.value;
  const attackId = $('attackSelect')?.value;
  const character = HSR_DATA?.characters?.[charId];
  if (!character) return;

  const selfBuffs = collectSelfAndEidolonBuffs(character);

  const atk = calculateAttackPower(selfBuffs);
  const multiplier = n('multiplier') / 100;
  const flatDamage = n('flatDamage');
  
  const baseDamage = atk * multiplier + flatDamage;

  const totalCritRate = Math.min(1, Math.max(0, p('critRate') + p('buffCrit') + (selfBuffs.critRate / 100)));
  const totalCritDmg = p('critDmg') + p('buffCritDmg') + (selfBuffs.critDmg / 100);
  const mode = $('critMode')?.value || 'average';

  let crit = 1 + (totalCritRate * totalCritDmg);
  if (mode === 'crit') crit = 1 + totalCritDmg;
  if (mode === 'noncrit') crit = 1;

  const damage = 1 + p('elementDmg') + p('buffDmg') + (selfBuffs.damagePercent / 100);

  const attackerLevel = n('charLevel') || 80;
  const enemyLevel = n('enemyLevel') || 95;
  const totalDefIgnore = Math.min(1, p('defDown') + p('defIgnore') + (selfBuffs.defIgnore / 100));
  const defense = (attackerLevel + 20) / ((attackerLevel + 20) + (enemyLevel + 20) * (1 - totalDefIgnore));

  const totalResPen = p('resPen') + (selfBuffs.resPen / 100);
  const resistance = Math.min(2.0, Math.max(0.2, 1 - (p('resistance') - totalResPen)));

  const taken = 1 + p('takenUp');
  const broken = $('broken')?.value === '1' ? 1.0 : (Number($('broken')?.value) || 0.9);

  // 合計ダメージ（ヒット数乗算なしの一括計算）
  const finalDamage = baseDamage * crit * damage * defense * resistance * taken * broken;

  if ($('damage')) $('damage').textContent = Math.floor(finalDamage).toLocaleString('ja-JP');
  if ($('resultAttack')) $('resultAttack').textContent = character.attacks?.[attackId]?.name || '-';

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

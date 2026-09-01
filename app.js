// ========================================
// HSR Damage Calculator - Calculation Core
// ========================================

const $ = id => document.getElementById(id);

const n = id => {
  const el = $(id);
  return el ? (Number(el.value) || 0) : 0;
};

const p = id => n(id) / 100;

// ========================================
// 初期化
// ========================================

function init() {
  const characterSelect = $('characterSelect');
  const lightConeSelect = $('lightConeSelect');

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
    lightConeSelect.addEventListener('change', () => {
      applyLightConeBuffs();
      calculate();
    });
  }

  const superSelect = $('coneSuper');
  if (superSelect) {
    superSelect.addEventListener('change', () => {
      applyLightConeBuffs();
      calculate();
    });
  }

  document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('input', calculate);
    element.addEventListener('change', calculate);
  });

  if ($('saveBtn')) $('saveBtn').onclick = saveSettings;
  if ($('loadBtn')) $('loadBtn').onclick = loadSettings;
  if ($('resetBtn')) $('resetBtn').onclick = () => location.reload();

  loadCharacter();
}

// ========================================
// キャラクター読み込み
// ========================================

function loadCharacter() {
  const charId = $('characterSelect')?.value;
  const character = HSR_DATA.characters[charId];
  if (!character) return;

  if ($('charLevel')) $('charLevel').value = character.level || 80;
  if ($('atk')) $('atk').value = character.baseStats.atk || 0;
  if ($('critRate')) $('critRate').value = character.stats.critRate || 5;
  if ($('critDmg')) $('critDmg').value = character.stats.critDmg || 50;
  if ($('speed')) $('speed').value = character.baseStats.speed || 100;
  if ($('elementDmg')) $('elementDmg').value = character.stats.elementDmg || 0;

  if ($('partyMain')) $('partyMain').textContent = character.name;
  if ($('resultCharacter')) $('resultCharacter').textContent = character.name;
  if ($('resultElement')) $('resultElement').textContent = character.element;

  const attackSelect = $('attackSelect');
  if (attackSelect) {
    attackSelect.innerHTML = '';
    Object.entries(character.attacks).forEach(([id, attack]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = attack.name;
      attackSelect.appendChild(option);
    });
    attackSelect.onchange = loadAttack;
  }

  loadAttack();
}

// ========================================
// 光円錐バフの自動反映
// ========================================

function applyLightConeBuffs() {
  const coneId = $('lightConeSelect')?.value;
  const rank = $('coneSuper')?.value || 'S1';
  const cone = HSR_DATA.lightCones[coneId];

  if (!cone || !cone.superimposition || !cone.superimposition[rank]) return;

  const stats = cone.superimposition[rank];
  
  // 装備時の自動バフ反映（手動入力バフ欄を更新）
  if (stats.atkPercent !== undefined && $('buffAtk')) {
    $('buffAtk').value = stats.atkPercent;
  }
  if (stats.damagePercent !== undefined && $('buffDmg')) {
    $('buffDmg').value = stats.damagePercent;
  }
}

// ========================================
// 攻撃スキル読み込み
// ========================================

function loadAttack() {
  const charId = $('characterSelect')?.value;
  const attackId = $('attackSelect')?.value;
  const character = HSR_DATA.characters[charId];
  if (!character) return;

  const attack = character.attacks[attackId];
  if (!attack) return;

  if ($('multiplier')) $('multiplier').value = attack.multiplier;
  calculate();
}

// ========================================
// ステータス & 係数計算
// ========================================

function calculateAttackPower() {
  const characterAtk = n('atk');
  const lightConeId = $('lightConeSelect')?.value;
  const lightCone = HSR_DATA.lightCones[lightConeId];
  const lightConeAtk = lightCone?.baseStats?.atk || 0;

  const relicAtk = p('relicAtk');
  const buffAtk = p('buffAtk');
  const flatAtk = n('flatAtk');

  const baseAtk = characterAtk + lightConeAtk;
  return baseAtk * (1 + relicAtk + buffAtk) + flatAtk;
}

function calculateCritMultiplier() {
  const critRate = Math.min(1, Math.max(0, p('critRate') + p('buffCrit')));
  const critDamage = p('critDmg') + p('buffCritDmg');
  const mode = $('critMode')?.value || 'average';

  if (mode === 'crit') return 1 + critDamage;
  if (mode === 'noncrit') return 1;
  return 1 + (critRate * critDamage);
}

function calculateDamageMultiplier() {
  return 1 + p('elementDmg') + p('buffDmg');
}

function calculateDefenseMultiplier() {
  const attackerLevel = n('charLevel') || 80;
  const enemyLevel = n('enemyLevel') || 80;

  const defReduction = Math.min(1, p('defDown') + p('defIgnore'));
  const defenderDefense = (enemyLevel + 20) * (1 - defReduction);

  return (attackerLevel + 20) / ((attackerLevel + 20) + defenderDefense);
}

function calculateResistanceMultiplier() {
  const baseRes = p('resistance');
  const resPen = p('resPen');
  const effectiveRes = baseRes - resPen;

  return Math.min(2.0, Math.max(0.2, 1 - effectiveRes));
}

function calculateTakenMultiplier() {
  return 1 + p('takenUp');
}

function calculateBrokenMultiplier() {
  const broken = $('broken')?.value;
  return broken === '1' ? 1.0 : (Number(broken) || 0.9);
}

// ========================================
// メインダメージ計算
// ========================================

function calculate() {
  const charId = $('characterSelect')?.value;
  const attackId = $('attackSelect')?.value;
  const character = HSR_DATA?.characters?.[charId];
  if (!character) return;

  const attack = character.attacks?.[attackId];
  if (!attack) return;

  const atk = calculateAttackPower();
  const multiplier = n('multiplier') / 100;
  const flatDamage = n('flatDamage');
  
  const baseDamage = atk * multiplier + flatDamage;

  const crit = calculateCritMultiplier();
  const damage = calculateDamageMultiplier();
  const defense = calculateDefenseMultiplier();
  const resistance = calculateResistanceMultiplier();
  const taken = calculateTakenMultiplier();
  const broken = calculateBrokenMultiplier();

  const hits = Math.max(1, n('hits'));
  const singleHitDamage = baseDamage * crit * damage * defense * resistance * taken * broken;
  const finalDamage = singleHitDamage * hits;

  if ($('damage')) {
    $('damage').textContent = Math.floor(finalDamage).toLocaleString('ja-JP');
  }
  if ($('resultAttack')) {
    $('resultAttack').textContent = attack.name;
  }

  if ($('qCrit')) $('qCrit').textContent = crit.toFixed(4);
  if ($('qDmg')) $('qDmg').textContent = damage.toFixed(4);
  if ($('qDef')) $('qDef').textContent = defense.toFixed(4);
  if ($('qRes')) $('qRes').textContent = resistance.toFixed(4);

  const breakdownEl = $('breakdown');
  if (breakdownEl) {
    const rows = [
      ['最終攻撃力', atk],
      ['スキル倍率', multiplier * 100],
      ['基礎ダメージ', baseDamage],
      ['会心係数', crit],
      ['与ダメージ係数', damage],
      ['防御係数', defense],
      ['耐性係数', resistance],
      ['被ダメージ係数', taken],
      ['撃破係数', broken],
      ['合計ダメージ', finalDamage]
    ];

    breakdownEl.innerHTML = rows
      .map(([name, value]) => {
        const isMultiplier = name.includes('係数');
        const formatted = isMultiplier
          ? value.toFixed(4)
          : value.toLocaleString('ja-JP', { maximumFractionDigits: 1 });

        return `
          <div>
            <span>${name}</span>
            <b>${formatted}</b>
          </div>
        `;
      })
      .join('');
  }
}

// ========================================
// 設定保存・読み込み
// ========================================

function saveSettings() {
  const data = {};
  document.querySelectorAll('input, select').forEach(element => {
    if (!element.id) return;
    data[element.id] = element.type === 'checkbox' ? element.checked : element.value;
  });

  localStorage.setItem('hsrCalc', JSON.stringify(data));
  alert('設定を保存しました');
}

function loadSettings() {
  const rawData = localStorage.getItem('hsrCalc');
  if (!rawData) {
    alert('保存データがありません');
    return;
  }

  const data = JSON.parse(rawData);

  if (data.characterSelect) {
    $('characterSelect').value = data.characterSelect;
    loadCharacter();
  }

  Object.entries(data).forEach(([id, value]) => {
    const element = $(id);
    if (!element) return;

    if (element.type === 'checkbox') {
      element.checked = value;
    } else {
      element.value = value;
    }
  });

  applyLightConeBuffs();
  calculate();
}

// ========================================
// 起動
// ========================================

window.addEventListener('DOMContentLoaded', init);

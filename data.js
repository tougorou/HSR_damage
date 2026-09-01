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

  // 遺物初期化
  ['relicSetSelect', 'ornamentSetSelect'].forEach(id => {
    const el = $(id);
    const dataObj = id === 'relicSetSelect' ? HSR_DATA.relicSets : HSR_DATA.ornamentSets;
    if (el && dataObj) {
      el.innerHTML = '';
      Object.entries(dataObj).forEach(([k, set]) => {
        const option = document.createElement('option');
        option.value = k;
        option.textContent = set.name;
        el.appendChild(option);
      });
      el.addEventListener('change', calculate);
    }
  });

  // パーティー枠初期化
  initPartySlots();

  $('charLevel')?.addEventListener('change', updateCharacterStats);
  $('eidolonSelect')?.addEventListener('change', calculate);
  $('coneSuper')?.addEventListener('change', loadLightCone);

  document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('input', calculate);
    element.addEventListener('change', calculate);
  });

  loadCharacter();
  loadLightCone();
}

function initPartySlots() {
  const partySelects = [$('partyMember1'), $('partyMember2'), $('partyMember3')];
  partySelects.forEach(select => {
    if (!select) return;
    select.innerHTML = '<option value="none">なし</option>';
    Object.entries(HSR_DATA.characters).forEach(([id, char]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = char.name;
      select.appendChild(option);
    });
    select.addEventListener('change', renderPartyBuffs);
  });
}

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
  }

  updateCharacterStats();
}

function renderEidolonOptions(character) {
  const eidolonSelect = $('eidolonSelect');
  if (!eidolonSelect) return;
  eidolonSelect.innerHTML = '';
  Object.entries(character.eidolons || {}).forEach(([lvl, data]) => {
    const option = document.createElement('option');
    option.value = lvl;
    option.textContent = data.name || `${lvl}凸`;
    eidolonSelect.appendChild(option);
  });
}

function renderSelfBuffs(character) {
  const container = $('selfBuffsContainer');
  if (!container) return;
  container.innerHTML = '';
  Object.entries(character.selfBuffs || {}).forEach(([key, buff]) => {
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

// パーティーバフのUI描画
function renderPartyBuffs() {
  const container = $('partyBuffsContainer');
  if (!container) return;
  container.innerHTML = '';

  const members = [$('partyMember1')?.value, $('partyMember2')?.value, $('partyMember3')?.value];
  members.forEach((memberId, idx) => {
    if (!memberId || memberId === 'none') return;
    const char = HSR_DATA.characters[memberId];
    if (char && char.providedPartyBuffs) {
      Object.entries(char.providedPartyBuffs).forEach(([bKey, buff]) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `partyBuff_${idx}_${bKey}`;
        checkbox.checked = true;
        checkbox.addEventListener('change', calculate);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` [${char.name}] ${buff.name}`));
        container.appendChild(label);
      });
    }
  });

  calculate();
}

function updateCharacterStats() {
  const charId = $('characterSelect')?.value;
  const character = HSR_DATA?.characters?.[charId];
  if (!character) return;

  const baseStats = character.statsByLevel?.[80] || { atk: 0 };
  const traceStats = character.traceStats || {};

  if ($('atk')) $('atk').value = baseStats.atk || 0;
  if ($('critRate')) $('critRate').value = 5.0 + (traceStats.critRate || 0);
  if ($('critDmg')) $('critDmg').value = 50.0 + (traceStats.critDmg || 0);
  if ($('elementDmg')) $('elementDmg').value = traceStats.elementDmg || 0;

  calculate();
}

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

function collectAllBuffs(character) {
  const result = { atkPercent: 0, critRate: 0, critDmg: 0, damagePercent: 0, defIgnore: 0, resPen: 0 };

  // 自己バフ
  Object.entries(character.selfBuffs || {}).forEach(([k, buff]) => {
    if ($(`selfBuff_${k}`)?.checked) {
      if (buff.atkPercent) result.atkPercent += buff.atkPercent;
      if (buff.critRate) result.critRate += buff.critRate;
      if (buff.critDmg) result.critDmg += buff.critDmg;
      if (buff.damagePercent) result.damagePercent += buff.damagePercent;
      if (buff.resPen) result.resPen += buff.resPen;
    }
  });

  // パーティーバフ
  const members = [$('partyMember1')?.value, $('partyMember2')?.value, $('partyMember3')?.value];
  members.forEach((mId, idx) => {
    if (!mId || mId === 'none') return;
    const char = HSR_DATA.characters[mId];
    if (char && char.providedPartyBuffs) {
      Object.entries(char.providedPartyBuffs).forEach(([bKey, buff]) => {
        if ($(`partyBuff_${idx}_${bKey}`)?.checked) {
          if (buff.atkPercent) result.atkPercent += buff.atkPercent;
          if (buff.critRate) result.critRate += buff.critRate;
          if (buff.critDmg) result.critDmg += buff.critDmg;
          if (buff.damagePercent) result.damagePercent += buff.damagePercent;
        }
      });
    }
  });

  // 遺物セット
  const relic = HSR_DATA.relicSets?.[$('relicSetSelect')?.value];
  if (relic) {
    if (relic.atkPercent) result.atkPercent += relic.atkPercent;
    if (relic.critRate) result.critRate += relic.critRate;
    if (relic.critDmg) result.critDmg += relic.critDmg;
    if (relic.damagePercent) result.damagePercent += relic.damagePercent;
  }

  return result;
}

function calculate() {
  const charId = $('characterSelect')?.value;
  const character = HSR_DATA?.characters?.[charId];
  if (!character) return;

  const allBuffs = collectAllBuffs(character);

  const baseAtk = n('atk') + (HSR_DATA.lightCones[$('lightConeSelect')?.value]?.statsByLevel?.[80]?.atk || 0);
  const totalAtk = baseAtk * (1 + p('relicAtk') + p('buffAtk') + (allBuffs.atkPercent / 100)) + n('flatAtk');

  const baseDamage = totalAtk * (n('multiplier') / 100) + n('flatDamage');

  const totalCritRate = Math.min(1, Math.max(0, p('critRate') + p('buffCrit') + p('relicCritRate') + (allBuffs.critRate / 100)));
  const totalCritDmg = p('critDmg') + p('buffCritDmg') + p('relicCritDmg') + (allBuffs.critDmg / 100);

  const crit = 1 + (totalCritRate * totalCritDmg);
  const damage = 1 + p('elementDmg') + p('buffDmg') + (allBuffs.damagePercent / 100);
  const defense = (80 + 20) / ((80 + 20) + (n('enemyLevel') + 20) * (1 - p('defDown') - p('defIgnore')));
  const resistance = 1 - (p('resistance') - p('resPen') - (allBuffs.resPen / 100));

  const finalDamage = baseDamage * crit * damage * defense * resistance * (1 + p('takenUp')) * (Number($('broken')?.value) || 0.9);

  if ($('damage')) $('damage').textContent = Math.floor(finalDamage).toLocaleString('ja-JP');
}

window.addEventListener('DOMContentLoaded', init);

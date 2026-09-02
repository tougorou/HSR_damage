document.addEventListener('DOMContentLoaded', () => {
  initMainAttackerUI();
  initSupportPartyUI();
  
  document.getElementById('calc-btn').addEventListener('click', calculateDamage);
  
  // メインキャラ切り替え時にUIを再構築
  document.getElementById('main-char-select').addEventListener('change', () => {
    updateMainCharEidolonOptions();
    updateMainSelfBuffsUI();
  });
});

// --- 1. メインアタッカー初期化 ---
function initMainAttackerUI() {
  const mainCharSel = document.getElementById('main-char-select');
  const mainLcSel = document.getElementById('main-lc-select');
  const mainRelicSel = document.getElementById('main-relic-select');
  const mainOrnSel = document.getElementById('main-ornament-select');

  // キャラ選択欄
  Object.keys(HSR_DATA.characters).forEach(key => {
    const char = HSR_DATA.characters[key];
    const opt = document.createElement('option');
    opt.value = char.id;
    opt.textContent = char.name;
    mainCharSel.appendChild(opt);
  });

  // 光円錐選択欄
  Object.keys(HSR_DATA.lightCones).forEach(key => {
    const lc = HSR_DATA.lightCones[key];
    const opt = document.createElement('option');
    opt.value = lc.id;
    opt.textContent = lc.name;
    mainLcSel.appendChild(opt);
  });

  // 遺物選択欄
  Object.keys(HSR_DATA.relicSets).forEach(key => {
    const r = HSR_DATA.relicSets[key];
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = r.name;
    mainRelicSel.appendChild(opt);
  });

  // オーナメント選択欄
  Object.keys(HSR_DATA.ornamentSets).forEach(key => {
    const o = HSR_DATA.ornamentSets[key];
    const opt = document.createElement('option');
    opt.value = o.id;
    opt.textContent = o.name;
    mainOrnSel.appendChild(opt);
  });

  updateMainCharEidolonOptions();
  updateMainSelfBuffsUI();
}

function updateMainCharEidolonOptions() {
  const charId = document.getElementById('main-char-select').value;
  const char = HSR_DATA.characters[charId];
  const eidolonSel = document.getElementById('main-char-eidolon');
  eidolonSel.innerHTML = '';

  if (char && char.eidolons) {
    Object.keys(char.eidolons).forEach(e => {
      const opt = document.createElement('option');
      opt.value = e;
      opt.textContent = char.eidolons[e].name || `${e}凸`;
      eidolonSel.appendChild(opt);
    });
  }
}

function updateMainSelfBuffsUI() {
  const charId = document.getElementById('main-char-select').value;
  const char = HSR_DATA.characters[charId];
  const container = document.getElementById('main-self-buffs');
  container.innerHTML = '';

  if (char && char.selfBuffs) {
    Object.keys(char.selfBuffs).forEach(key => {
      const buff = char.selfBuffs[key];
      const label = document.createElement('label');
      label.className = 'checkbox-label';
      label.innerHTML = `
        <input type="checkbox" class="main-buff-check" value="${key}" checked>
        ${buff.name}
      `;
      container.appendChild(label);
    });
  }
}

// --- 2. サポートキャラ編集UIの構築（3枠分） ---
function initSupportPartyUI() {
  const container = document.getElementById('party-members-container');
  container.innerHTML = '';

  for (let i = 1; i <= 3; i++) {
    const card = document.createElement('div');
    card.className = 'support-card';
    card.id = `support-slot-${i}`;

    card.innerHTML = `
      <div class="support-header">
        <h3>サポート枠 ${i}</h3>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>キャラ選択:</label>
          <select class="supp-char-select" data-slot="${i}">
            <option value="none">なし</option>
          </select>
        </div>
        <div class="form-group">
          <label>星魂（凸数）:</label>
          <select class="supp-eidolon-select" data-slot="${i}">
            <option value="0">無凸</option>
          </select>
        </div>
        <div class="form-group">
          <label>装備光円錐:</label>
          <select class="supp-lc-select" data-slot="${i}">
            <option value="none">未装備</option>
          </select>
        </div>
        <div class="form-group">
          <label>光円錐重畳:</label>
          <select class="supp-lc-rank" data-slot="${i}">
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
            <option value="S4">S4</option>
            <option value="S5">S5</option>
          </select>
        </div>
        <div class="form-group">
          <label>トンネル遺物:</label>
          <select class="supp-relic-select" data-slot="${i}">
            <option value="none">なし</option>
          </select>
        </div>
        <div class="form-group">
          <label>次元オーナメント:</label>
          <select class="supp-ornament-select" data-slot="${i}">
            <option value="none">なし</option>
          </select>
        </div>
      </div>
      <div class="supp-buffs-container" id="supp-buffs-${i}"></div>
    `;

    container.appendChild(card);

    // ドロップダウン選択肢の生成
    const charSel = card.querySelector('.supp-char-select');
    const lcSel = card.querySelector('.supp-lc-select');
    const relicSel = card.querySelector('.supp-relic-select');
    const ornSel = card.querySelector('.supp-ornament-select');

    Object.keys(HSR_DATA.characters).forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = HSR_DATA.characters[key].name;
      charSel.appendChild(opt);
    });

    Object.keys(HSR_DATA.lightCones).forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = HSR_DATA.lightCones[key].name;
      lcSel.appendChild(opt);
    });

    Object.keys(HSR_DATA.relicSets).forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = HSR_DATA.relicSets[key].name;
      relicSel.appendChild(opt);
    });

    Object.keys(HSR_DATA.ornamentSets).forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = HSR_DATA.ornamentSets[key].name;
      ornSel.appendChild(opt);
    });

    // イベントバインド
    charSel.addEventListener('change', (e) => updateSupportSlotUI(e.target.dataset.slot));
  }
}

function updateSupportSlotUI(slot) {
  const card = document.getElementById(`support-slot-${slot}`);
  const charId = card.querySelector('.supp-char-select').value;
  const eidolonSel = card.querySelector('.supp-eidolon-select');
  const buffContainer = card.querySelector('.supp-buffs-container');

  eidolonSel.innerHTML = '';
  buffContainer.innerHTML = '';

  if (charId === 'none') return;

  const char = HSR_DATA.characters[charId];

  // 凸数選択肢更新
  if (char && char.eidolons) {
    Object.keys(char.eidolons).forEach(e => {
      const opt = document.createElement('option');
      opt.value = e;
      opt.textContent = char.eidolons[e].name || `${e}凸`;
      eidolonSel.appendChild(opt);
    });
  }

  // パーティ提供バフの切り替えUI生成
  if (char && char.providedPartyBuffs) {
    const title = document.createElement('strong');
    title.textContent = '提供可能なパーティバフ:';
    buffContainer.appendChild(title);

    Object.keys(char.providedPartyBuffs).forEach(key => {
      const buff = char.providedPartyBuffs[key];
      const label = document.createElement('label');
      label.className = 'checkbox-label';
      label.innerHTML = `
        <input type="checkbox" class="supp-buff-check" data-slot="${slot}" value="${key}" checked>
        ${buff.name}
      `;
      buffContainer.appendChild(label);
    });
  }
}

// --- 3. ダメージ計算ロジック ---
function calculateDamage() {
  const mainCharId = document.getElementById('main-char-select').value;
  const mainLevel = document.getElementById('main-char-level').value;
  const mainEidolon = document.getElementById('main-char-eidolon').value;
  const mainLcId = document.getElementById('main-lc-select').value;
  const mainLcRank = document.getElementById('main-lc-rank').value;
  const mainRelicId = document.getElementById('main-relic-select').value;
  const mainOrnId = document.getElementById('main-ornament-select').value;

  const mainChar = HSR_DATA.characters[mainCharId];
  const mainLc = HSR_DATA.lightCones[mainLcId];
  const mainRelic = HSR_DATA.relicSets[mainRelicId];
  const mainOrn = HSR_DATA.ornamentSets[mainOrnId];

  // 1. 基礎ステータス計算
  const baseHp = (mainChar.statsByLevel[mainLevel]?.hp || 0) + (mainLc.statsByLevel?.[mainLevel]?.hp || 0);
  const baseAtk = (mainChar.statsByLevel[mainLevel]?.atk || 0) + (mainLc.statsByLevel?.[mainLevel]?.atk || 0);
  const baseDef = (mainChar.statsByLevel[mainLevel]?.def || 0) + (mainLc.statsByLevel?.[mainLevel]?.def || 0);

  // ステータス加算用バフ集計変数
  let totalAtkPercent = 0;
  let totalAtkFlat = parseFloat(document.getElementById('sub-atk-flat').value) || 0;
  let totalCritRate = 5.0 + (parseFloat(document.getElementById('sub-crit-rate').value) || 0); // 基礎会心率 5%
  let totalCritDmg = 50.0 + (parseFloat(document.getElementById('sub-crit-dmg').value) || 0); // 基礎会心DMG 50%
  let totalDmgPercent = parseFloat(document.getElementById('sub-dmg-percent').value) || 0;
  let totalDefIgnore = 0;
  let totalResPen = 0;

  totalAtkPercent += parseFloat(document.getElementById('sub-atk-percent').value) || 0;

  // 軌跡ステータス加算
  if (mainChar.traceStats) {
    totalCritRate += mainChar.traceStats.critRate || 0;
    totalCritDmg += mainChar.traceStats.critDmg || 0;
    totalDmgPercent += mainChar.traceStats.elementDmg || 0;
  }

  // メイン光円錐重畳効果
  if (mainLc.superimposition && mainLc.superimposition[mainLcRank]) {
    const lcEffect = mainLc.superimposition[mainLcRank];
    totalAtkPercent += lcEffect.atkPercent || 0;
    totalCritRate += lcEffect.critRate || 0;
    totalCritDmg += lcEffect.critDmg || 0;
    totalDmgPercent += lcEffect.damagePercent || 0;
  }

  // メイン遺物セット効果
  if (mainRelic) {
    totalAtkPercent += mainRelic.atkPercent || 0;
    totalCritRate += mainRelic.critRate || 0;
    totalCritDmg += mainRelic.critDmg || 0;
    totalDmgPercent += mainRelic.damagePercent || 0;
    totalDefIgnore += mainRelic.defIgnore || 0;
  }

  // メインオーナメントセット効果
  if (mainOrn) {
    totalAtkPercent += mainOrn.atkPercent || 0;
    totalCritRate += mainOrn.critRate || 0;
    totalCritDmg += mainOrn.critDmg || 0;
    totalDmgPercent += mainOrn.damagePercent || 0;
  }

  // 2. メインキャラ自己バフ・星魂効果
  document.querySelectorAll('.main-buff-check:checked').forEach(cb => {
    const buff = mainChar.selfBuffs[cb.value];
    if (buff) {
      totalAtkPercent += buff.atkPercent || 0;
      totalCritRate += buff.critRate || 0;
      totalCritDmg += buff.critDmg || 0;
      totalDmgPercent += buff.damagePercent || 0;
      totalResPen += buff.resPen || 0;
      totalDefIgnore += buff.defIgnore || 0;
    }
  });

  if (mainChar.eidolons && mainChar.eidolons[mainEidolon]) {
    const eEffect = mainChar.eidolons[mainEidolon];
    totalCritRate += eEffect.critRate || 0;
    totalCritDmg += eEffect.critDmg || 0;
    totalDmgPercent += eEffect.damagePercent || 0;
    totalResPen += eEffect.resPen || 0;
    totalDefIgnore += eEffect.defIgnore || 0;
  }

  // 3. サポートキャラ編集欄からの効果計算（全3スロット分）
  for (let i = 1; i <= 3; i++) {
    const card = document.getElementById(`support-slot-${i}`);
    if (!card) continue;

    const suppCharId = card.querySelector('.supp-char-select').value;
    if (suppCharId === 'none') continue;

    const suppChar = HSR_DATA.characters[suppCharId];
    const suppEidolon = card.querySelector('.supp-eidolon-select').value;
    const suppLcId = card.querySelector('.supp-lc-select').value;
    const suppLcRank = card.querySelector('.supp-lc-rank').value;
    const suppRelicId = card.querySelector('.supp-relic-select').value;
    const suppOrnId = card.querySelector('.supp-ornament-select').value;

    const suppLc = HSR_DATA.lightCones[suppLcId];
    const suppRelic = HSR_DATA.relicSets[suppRelicId];
    const suppOrn = HSR_DATA.ornamentSets[suppOrnId];

    // サポートのオーナメントが全体バフ（例: 折れた竜骨）の場合の加算
    if (suppOrnId === 'keel') {
      totalCritDmg += suppOrn.critDmg || 10;
    }

    // サポートのチェックボックスでONになっている提供バフを加算
    card.querySelectorAll('.supp-buff-check:checked').forEach(cb => {
      const buff = suppChar.providedPartyBuffs?.[cb.value];
      if (buff) {
        totalAtkPercent += buff.atkPercent || 0;
        totalCritRate += buff.critRate || 0;
        totalCritDmg += buff.critDmg || 0;
        totalDmgPercent += buff.damagePercent || 0;
        totalResPen += buff.resPen || 0;
        totalDefIgnore += buff.defIgnore || 0;
      }
    });
  }

  // 4. 最終ステータスの計算
  const finalAtk = baseAtk * (1 + totalAtkPercent / 100) + totalAtkFlat;

  // 画面に基本ステータスを反映
  document.getElementById('res-total-atk').textContent = Math.round(finalAtk);
  document.getElementById('res-crit-rate').textContent = totalCritRate.toFixed(1);
  document.getElementById('res-crit-dmg').textContent = totalCritDmg.toFixed(1);
  document.getElementById('res-dmg-boost').textContent = totalDmgPercent.toFixed(1);

  // 5. 各攻撃スキルのダメージ計算
  const resultsBody = document.getElementById('damage-results-body');
  resultsBody.innerHTML = '';

  if (!mainChar.attacks) {
    resultsBody.innerHTML = '<tr><td colspan="4">攻撃データが定義されていません</td></tr>';
    return;
  }

  // 防御補正・耐性補正（簡易計算：標準敵レベル80、耐性20%想定）
  const defMultiplier = (80 + 20) / ((80 + 20) + (80 + 20) * (1 - Math.min(totalDefIgnore, 100) / 100));
  const resMultiplier = 1.0 - (0.20 - (totalResPen / 100));

  Object.keys(mainChar.attacks).forEach(atkKey => {
    const atk = mainChar.attacks[atkKey];
    const multiplier = (atk.multipliers[10] || atk.multipliers[6] || 100) / 100;

    // 基本ダメージ基礎 = 攻撃力 * 倍率
    const baseDamage = finalAtk * multiplier;

    // 補正適用ダメージ
    const nonCritDmg = baseDamage * (1 + totalDmgPercent / 100) * defMultiplier * resMultiplier;
    const critDmg = nonCritDmg * (1 + totalCritDmg / 100);

    const effCritRate = Math.min(Math.max(totalCritRate, 0), 100) / 100;
    const avgDmg = nonCritDmg * (1 - effCritRate) + critDmg * effCritRate;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${atk.name}</td>
      <td>${Math.round(nonCritDmg).toLocaleString()}</td>
      <td><strong style="color: #e03131;">${Math.round(critDmg).toLocaleString()}</strong></td>
      <td><strong style="color: #2f9e44;">${Math.round(avgDmg).toLocaleString()}</strong></td>
    `;
    resultsBody.appendChild(tr);
  });
}

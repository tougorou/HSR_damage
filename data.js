// ========================================
// HSR Damage Calculator - Master Data
// ========================================

const HSR_DATA = {
  characters: {
    gilgamesh: {
      id: 'gilgamesh',
      name: 'ギルガメッシュ',
      element: '雷',
      path: '壊滅',
      
      statsByLevel: {
        80: { hp: 1203, atk: 698, def: 441, speed: 102 },
        70: { hp: 1050, atk: 610, def: 385, speed: 102 }
      },

      traceStats: {
        critRate: 12.0,   // 軌跡合計会心率 %
        critDmg: 0.0,
        elementDmg: 14.4  // 雷属性与ダメージ %
      },

      selfBuffs: {
        skillAtkBuff: { name: '戦闘スキル：攻撃力UP', atkPercent: 40.0 },
        talentCritDmg: { name: '天賦：会心ダメージUP', critDmg: 35.0 },
        ultResPen: { name: '必殺技：全属性耐性貫通', resPen: 20.0 },
        ebaDmgBuff: { name: '強化通常：与ダメージUP', damagePercent: 45.0 }
      },

      eidolons: {
        0: { name: '無凸' },
        1: { name: '1凸: 王の宝物庫', critRate: 10.0, defIgnore: 12.0 },
        2: { name: '2凸: 天の鎖', resPen: 15.0 },
        3: { name: '3凸: 万象の観照' },
        4: { name: '4凸: 英雄の領域', damagePercent: 30.0 },
        5: { name: '5凸: 原初の法則' },
        6: { name: '6凸: 開天辟地', critDmg: 50.0, defIgnore: 20.0 }
      },

      attacks: {
        basic: {
          id: 'basic',
          name: '通常攻撃',
          type: 'basic',
          multipliers: { 1: 50, 6: 100, 7: 110 }
        },
        enhancedBasic: {
          id: 'enhancedBasic',
          name: '強化通常攻撃（王の財宝）',
          type: 'basic',
          multipliers: { 1: 110, 6: 220, 7: 242 }
        },
        skill: {
          id: 'skill',
          name: '戦闘スキル',
          type: 'skill',
          multipliers: { 1: 100, 10: 200, 12: 220 }
        },
        ult: {
          id: 'ult',
          name: '必殺技（エヌマ・エリシュ）',
          type: 'ult',
          multipliers: { 1: 200, 10: 400, 12: 440 }
        }
      }
    }
  },

  lightCones: {
    none: {
      id: 'none',
      name: '未装備',
      statsByLevel: { 80: { hp: 0, atk: 0, def: 0 } },
      superimposition: {}
    },
    gilgamesh_signature: {
      id: 'gilgamesh_signature',
      name: '天地を乖離す開闢の星',
      path: '壊滅',
      statsByLevel: {
        80: { hp: 1164, atk: 635, def: 463 }
      },
      superimposition: {
        S1: { atkPercent: 24, damagePercent: 24, critDmg: 20 },
        S2: { atkPercent: 28, damagePercent: 28, critDmg: 23 },
        S3: { atkPercent: 32, damagePercent: 32, critDmg: 26 },
        S4: { atkPercent: 36, damagePercent: 36, critDmg: 29 },
        S5: { atkPercent: 40, damagePercent: 40, critDmg: 32 }
      }
    }
  },

  // トンネル遺物セット効果
  relicSets: {
    none: { id: 'none', name: 'なし', atkPercent: 0, critRate: 0, critDmg: 0, damagePercent: 0, defIgnore: 0 },
    musketeer: { id: 'musketeer', name: '草穂ガンマン (4)', atkPercent: 12, damagePercent: 10 },
    banditry: { id: 'banditry', name: '荒地を彷徨う廃土客 (4)', damagePercent: 10, critRate: 10, critDmg: 20 },
    prisoner: { id: 'prisoner', name: '深牢に繋がれる囚人 (4)', atkPercent: 12, defIgnore: 18 },
    pioneer: { id: 'pioneer', name: '死水に潜る先駆者 (4)', damagePercent: 12, critRate: 8, critDmg: 24 },
    sizzling: { id: 'sizzling', name: 'バンド (4)', damagePercent: 10, atkPercent: 20 }
  },

  // 次元界オーナメントセット効果
  ornamentSets: {
    none: { id: 'none', name: 'なし', atkPercent: 0, critRate: 0, critDmg: 0, damagePercent: 0 },
    salsotto: { id: 'salsotto', name: '自転の自認サルソット (2)', critRate: 8, damagePercent: 15 },
    arena: { id: 'arena', name: '星々の競技場 (2)', critRate: 8, damagePercent: 20 },
    glamoth: { id: 'glamoth', name: '蒼穹戦線グラモト (2)', atkPercent: 12, damagePercent: 18 },
    keel: { id: 'keel', name: '折れた竜骨 (2)', critDmg: 10 },
    space: { id: 'space', name: '宇宙封印ステーション (2)', atkPercent: 24 }
  }
};

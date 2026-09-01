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
      
      // レベルごとの基礎ステータス (Lv1〜Lv80)
      statsByLevel: {
        80: { hp: 1203, atk: 698, def: 441, speed: 102 },
        70: { hp: 1050, atk: 610, def: 385, speed: 102 }
      },

      // 軌跡・ステータスボーナス（キャラクター固有のステータス上昇）
      traceStats: {
        critRate: 12.0,   // 軌跡合計会心率 %
        critDmg: 0.0,
        elementDmg: 14.4  // 属性与ダメ %
      },

      // 攻撃スキルの軌跡Lv別倍率 (%)
      attacks: {
        basic: {
          id: 'basic',
          name: '通常攻撃',
          type: 'basic',
          multipliers: { 1: 50, 6: 100, 7: 110 } // 軌跡Lv: 倍率%
        },
        skill: {
          id: 'skill',
          name: '戦闘スキル',
          type: 'skill',
          multipliers: { 1: 100, 10: 200, 12: 220 }
        },
        ult: {
          id: 'ult',
          name: '必殺技',
          type: 'ult',
          multipliers: { 1: 150, 10: 300, 12: 330 }
        },
        talent: {
          id: 'talent',
          name: '天賦',
          type: 'talent',
          multipliers: { 1: 75, 10: 150, 12: 165 }
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
    clara_signature: {
      id: 'clara_signature',
      name: 'かけがえのないもの',
      path: '壊滅',
      statsByLevel: {
        80: { hp: 1164, atk: 582, def: 396 },
        70: { hp: 1018, atk: 509, def: 346 }
      },
      superimposition: {
        S1: { atkPercent: 24, damagePercent: 24 },
        S2: { atkPercent: 28, damagePercent: 28 },
        S3: { atkPercent: 32, damagePercent: 32 },
        S4: { atkPercent: 36, damagePercent: 36 },
        S5: { atkPercent: 40, damagePercent: 40 }
      }
    }
  }
};

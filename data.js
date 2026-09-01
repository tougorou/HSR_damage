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
      statsByLevel: { 80: { hp: 1203, atk: 698, def: 441, speed: 102 } },
      traceStats: { critRate: 12.0, critDmg: 0.0, elementDmg: 14.4 },
      selfBuffs: {
        skillAtkBuff: { name: '戦闘スキル：攻撃力UP', atkPercent: 40.0 },
        talentCritDmg: { name: '天賦：会心ダメージUP', critDmg: 35.0 },
        ultResPen: { name: '必殺技：全属性耐性貫通', resPen: 20.0 }
      },
      eidolons: {
        0: { name: '無凸' },
        1: { name: '1凸', critRate: 10.0, defIgnore: 12.0 },
        6: { name: '6凸', critDmg: 50.0, defIgnore: 20.0 }
      },
      attacks: {
        basic: { id: 'basic', name: '通常攻撃', type: 'basic', multipliers: { 6: 100 } },
        skill: { id: 'skill', name: '戦闘スキル', type: 'skill', multipliers: { 10: 200 } },
        ult: { id: 'ult', name: '必殺技', type: 'ult', multipliers: { 10: 400 } }
      }
    },

    saber: {
      id: 'saber',
      name: 'セイバー',
      element: '物理',
      path: '壊滅',
      statsByLevel: { 80: { hp: 1241, atk: 679, def: 485, speed: 101 } },
      traceStats: { critRate: 8.0, critDmg: 16.0, elementDmg: 12.0 },
      selfBuffs: {
        manaBurst: { name: '魔力放出（与ダメUP）', damagePercent: 50.0 },
        excalibur: { name: '約束された勝利の剣（会心率UP）', critRate: 15.0 }
      },
      eidolons: {
        0: { name: '無凸' },
        1: { name: '1凸', damagePercent: 20.0 },
        2: { name: '2凸', defIgnore: 16.0 }
      },
      attacks: {
        basic: { id: 'basic', name: '通常攻撃', type: 'basic', multipliers: { 6: 100 } },
        skill: { id: 'skill', name: '戦闘スキル', type: 'skill', multipliers: { 10: 220 } },
        ult: { id: 'ult', name: '必殺技（約束された勝利の剣）', type: 'ult', multipliers: { 10: 450 } }
      }
    },

    blade: {
      id: 'blade',
      name: '刃',
      element: '風',
      path: '壊滅',
      statsByLevel: { 80: { hp: 1358, atk: 543, def: 485, speed: 97 } },
      traceStats: { critRate: 12.0, hpPercent: 18.0, maxHp: 0 },
      selfBuffs: {
        hellscape: { name: '地獄変（与ダメUP）', damagePercent: 40.0 }
      },
      eidolons: {
        0: { name: '無凸' },
        1: { name: '1凸', damagePercent: 15.0 },
        2: { name: '2凸', critRate: 15.0 }
      },
      attacks: {
        basic: { id: 'basic', name: '通常攻撃', type: 'basic', multipliers: { 6: 100 } },
        enhancedBasic: { id: 'enhancedBasic', name: '強化通常攻撃（支離剣）', type: 'basic', multipliers: { 6: 100 } },
        ult: { id: 'ult', name: '必殺技（無間剣樹）', type: 'ult', multipliers: { 10: 240 } }
      }
    },

    huohuo: {
      id: 'huohuo',
      name: 'フォフォ',
      element: '風',
      path: '豊穣',
      statsByLevel: { 80: { hp: 1358, atk: 601, def: 509, speed: 98 } },
      traceStats: { hpPercent: 18.0, speed: 5 },
      selfBuffs: {},
      // パーティー全体に配るバフ定義
      providedPartyBuffs: {
        ultAtkBuff: { name: 'フォフォ必殺技：攻撃力+40%', atkPercent: 40.0 }
      },
      eidolons: {
        0: { name: '無凸' },
        1: { name: '1凸: 速度+12%' }
      },
      attacks: {
        basic: { id: 'basic', name: '通常攻撃', type: 'basic', multipliers: { 6: 100 } }
      }
    }
  },

  lightCones: {
    none: { id: 'none', name: '未装備', statsByLevel: { 80: { hp: 0, atk: 0, def: 0 } }, superimposition: {} },
    gilgamesh_signature: {
      id: 'gilgamesh_signature',
      name: '天地を乖離す開闢の星',
      statsByLevel: { 80: { hp: 1164, atk: 635, def: 463 } },
      superimposition: {
        S1: { atkPercent: 24, damagePercent: 24, critDmg: 20 },
        S5: { atkPercent: 40, damagePercent: 40, critDmg: 32 }
      }
    },
    something_irreplaceable: {
      id: 'something_irreplaceable',
      name: 'かけがえのないもの',
      statsByLevel: { 80: { hp: 1164, atk: 582, def: 396 } },
      superimposition: {
        S1: { atkPercent: 24, damagePercent: 24 },
        S5: { atkPercent: 40, damagePercent: 40 }
      }
    },
    unreachable_side: {
      id: 'unreachable_side',
      name: '着けない彼岸（刃モチーフ）',
      statsByLevel: { 80: { hp: 1270, atk: 582, def: 330 } },
      superimposition: {
        S1: { critRate: 18, damagePercent: 24 },
        S5: { critRate: 30, damagePercent: 40 }
      }
    },
    night_of_fright: {
      id: 'night_of_fright',
      name: '驚魂の夜（フォフォモチーフ）',
      statsByLevel: { 80: { hp: 1270, atk: 476, def: 529 } },
      superimposition: {
        S1: { atkPercent: 12 },
        S5: { atkPercent: 24 }
      }
    }
  },

  relicSets: {
    none: { id: 'none', name: 'なし', atkPercent: 0, critRate: 0, critDmg: 0, damagePercent: 0, defIgnore: 0 },
    musketeer: { id: 'musketeer', name: '草穂ガンマン (4)', atkPercent: 12, damagePercent: 10 },
    longevous: { id: 'longevous', name: '宝命長存の弟子 (4)', critRate: 16 },
    pioneer: { id: 'pioneer', name: '死水に潜る先駆者 (4)', damagePercent: 12, critRate: 8, critDmg: 24 }
  },

  ornamentSets: {
    none: { id: 'none', name: 'なし', atkPercent: 0, critRate: 0, critDmg: 0, damagePercent: 0 },
    salsotto: { id: 'salsotto', name: '自転の自認サルソット (2)', critRate: 8, damagePercent: 15 },
    arena: { id: 'arena', name: '星々の競技場 (2)', critRate: 8, damagePercent: 20 },
    keel: { id: 'keel', name: '折れた竜骨 (2)', critDmg: 10 }
  }
};

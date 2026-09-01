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
      traceStats: { critRate: 12.0, critDmg: 0.0, elementDmg: 14.4 },
      selfBuffs: {
        skillAtkBuff: { name: '戦闘スキル：攻撃力UP', atkPercent: 40.0 },
        talentCritDmg: { name: '天賦：会心ダメージUP', critDmg: 35.0 },
        ultResPen: { name: '必殺技：全属性耐性貫通', resPen: 20.0 }
      },
      eidolons: {
        0: { name: '無凸' },
        1: { name: '1凸', critRate: 10.0, defIgnore: 12.0 },
        2: { name: '2凸', resPen: 15.0 },
        6: { name: '6凸', critDmg: 50.0, defIgnore: 20.0 }
      },
      attacks: {
        basic: { id: 'basic', name: '通常攻撃', type: 'basic', multipliers: { 1: 50, 6: 100 } },
        skill: { id: 'skill', name: '戦闘スキル', type: 'skill', multipliers: { 1: 100, 10: 200 } },
        ult: { id: 'ult', name: '必殺技（エヌマ・エリシュ）', type: 'ult', multipliers: { 1: 200, 10: 400 } }
      }
    },

    saber: {
      id: 'saber',
      name: 'セイバー',
      element: '物理',
      path: '壊滅',
      statsByLevel: {
        80: { hp: 1241, atk: 679, def: 485, speed: 101 },
        70: { hp: 1080, atk: 590, def: 420, speed: 101 }
      },
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
        basic: { id: 'basic', name: '通常攻撃', type: 'basic', multipliers: { 1: 50, 6: 100 } },
        skill: { id: 'skill', name: '戦闘スキル', type: 'skill', multipliers: { 1: 110, 10: 220 } },
        ult: { id: 'ult', name: '必殺技（約束された勝利の剣）', type: 'ult', multipliers: { 1: 225, 10: 450 } }
      }
    },

    // 修正：千冶・刃（通常刃とは異なる独自性能）
    senji_blade: {
      id: 'senji_blade',
      name: '千冶・刃',
      element: '風',
      path: '壊滅',
      statsByLevel: {
        80: { hp: 1419, atk: 601, def: 485, speed: 97 },
        70: { hp: 1230, atk: 520, def: 420, speed: 97 }
      },
      traceStats: { critRate: 12.0, elementDmg: 14.4 },
      selfBuffs: {
        senjiState: { name: '千冶展開（与ダメUP・会心ダメージUP）', damagePercent: 45.0, critDmg: 30.0 }
      },
      eidolons: {
        0: { name: '無凸' },
        1: { name: '1凸: 必殺技ダメージUP', damagePercent: 25.0 },
        2: { name: '2凸: 会心率UP', critRate: 15.0 },
        6: { name: '6凸: 耐性貫通・防御無視追加', resPen: 20.0, defIgnore: 18.0 }
      },
      attacks: {
        basic: { id: 'basic', name: '通常攻撃', type: 'basic', multipliers: { 1: 50, 6: 100 } },
        enhancedBasic: { id: 'enhancedBasic', name: '強化通常攻撃（千冶一閃）', type: 'basic', multipliers: { 1: 130, 6: 260 } },
        skill: { id: 'skill', name: '戦闘スキル', type: 'skill', multipliers: { 1: 100, 10: 200 } },
        ult: { id: 'ult', name: '必殺技（無銘・千刃屠殺）', type: 'ult', multipliers: { 1: 210, 10: 420 } }
      }
    },

    huohuo: {
      id: 'huohuo',
      name: 'フォフォ',
      element: '風',
      path: '豊穣',
      statsByLevel: {
        80: { hp: 1358, atk: 601, def: 509, speed: 98 },
        70: { hp: 1180, atk: 520, def: 440, speed: 98 }
      },
      traceStats: { hpPercent: 18.0, speed: 5 },
      selfBuffs: {},
      providedPartyBuffs: {
        ultAtkBuff: { name: '必殺技：攻撃力+40%', atkPercent: 40.0 }
      },
      eidolons: {
        0: { name: '無凸' },
        1: { name: '1凸: 速度+12%' }
      },
      attacks: {
        basic: { id: 'basic', name: '通常攻撃', type: 'basic', multipliers: { 1: 50, 6: 100 } }
      }
    }
  },

  lightCones: {
    none: {
      id: 'none',
      name: '未装備',
      statsByLevel: { 80: { hp: 0, atk: 0, def: 0 }, 70: { hp: 0, atk: 0, def: 0 } },
      superimposition: { S1: {}, S2: {}, S3: {}, S4: {}, S5: {} }
    },
    gilgamesh_signature: {
      id: 'gilgamesh_signature',
      name: '天地を乖離す開闢の星',
      statsByLevel: {
        80: { hp: 1164, atk: 635, def: 463 },
        70: { hp: 1018, atk: 555, def: 405 }
      },
      superimposition: {
        S1: { atkPercent: 24, damagePercent: 24, critDmg: 20 },
        S2: { atkPercent: 28, damagePercent: 28, critDmg: 23 },
        S3: { atkPercent: 32, damagePercent: 32, critDmg: 26 },
        S4: { atkPercent: 36, damagePercent: 36, critDmg: 29 },
        S5: { atkPercent: 40, damagePercent: 40, critDmg: 32 }
      }
    },
    something_irreplaceable: {
      id: 'something_irreplaceable',
      name: 'かけがえのないもの',
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
    },
    unreachable_side: {
      id: 'unreachable_side',
      name: '着けない彼岸',
      statsByLevel: {
        80: { hp: 1270, atk: 582, def: 330 },
        70: { hp: 1110, atk: 509, def: 288 }
      },
      superimposition: {
        S1: { critRate: 18, damagePercent: 24 },
        S2: { critRate: 21, damagePercent: 28 },
        S3: { critRate: 24, damagePercent: 32 },
        S4: { critRate: 27, damagePercent: 36 },
        S5: { critRate: 30, damagePercent: 40 }
      }
    },
    night_of_fright: {
      id: 'night_of_fright',
      name: '驚魂の夜',
      statsByLevel: {
        80: { hp: 1270, atk: 476, def: 529 },
        70: { hp: 1110, atk: 416, def: 462 }
      },
      superimposition: {
        S1: { atkPercent: 12 },
        S2: { atkPercent: 15 },
        S3: { atkPercent: 18 },
        S4: { atkPercent: 21 },
        S5: { atkPercent: 24 }
      }
    }
  },

relicSets: {
    none: { id: 'none', name: 'なし', atkPercent: 0, critRate: 0, critDmg: 0, damagePercent: 0, defIgnore: 0 },
    musketeer: { id: 'musketeer', name: '草穂ガンマン (4)', atkPercent: 12, damagePercent: 10 },
    longevous: { id: 'longevous', name: '宝命長存の弟子 (4)', critRate: 16 },
    pioneer: { id: 'pioneer', name: '死水に潜る先駆者 (4)', damagePercent: 12, critRate: 8, critDmg: 24 },
    prisoner: { id: 'prisoner', name: '深牢に繋がれる囚人 (4)', atkPercent: 12, defIgnore: 18 },
    
    // --- 新規追加 ---
    scholar: { id: 'scholar', name: '知識の海に溺れる学者 (4)', critRate: 8, damagePercent: 20 },
    captain: { id: 'captain', name: '荒海を超える船長 (4)', atkPercent: 12, damagePercent: 16 },
    artisan: { id: 'artisan', name: '神業を探求する名匠 (4)', speed: 6, critDmg: 18 },
    sun_thunder: { id: 'sun_thunder', name: '烈陽と雷鳴の武神 (4)', damagePercent: 10, defIgnore: 12 }
  },

ornamentSets: {
    none: { id: 'none', name: 'なし', atkPercent: 0, critRate: 0, critDmg: 0, damagePercent: 0 },
    arena: { id: 'arena', name: '星々の競技場 (2)', critRate: 8, damagePercent: 20 },
    glamoth: { id: 'glamoth', name: '蒼穹戦線グラモト (2)', atkPercent: 12, damagePercent: 18 },

    // --- 修正・追加 ---
    keel: { id: 'keel', name: '折れた竜骨 (2)', critDmg: 10 },
    salsotto: { id: 'salsotto', name: '自転が止まったサルソット (2)', critRate: 8, damagePercent: 15 },
    astronomical_institute: { id: 'astronomical_institute', name: '宇宙生命科学研究院 (2)', atkPercent: 12, damagePercent: 12 },
    bone_collector: { id: 'bone_collector', name: '静謐な拾骨地 (2)', critDmg: 16 }
},

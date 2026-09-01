// ========================================
// HSR Damage Calculator - Master Data
// ========================================

const HSR_DATA = {

  // ----------------------------------------
  // キャラクター
  // ----------------------------------------
  characters: {

    gilgamesh: {
      id: 'gilgamesh',
      name: 'ギルガメッシュ',

      element: '雷',
      path: '壊滅',

      level: 90,

      // 基礎ステータス
      baseStats: {
        hp: 0,
        atk: 3742,
        def: 0,
        speed: 100
      },

      // 入力画面に表示する初期値
      stats: {
        critRate: 100,
        critDmg: 150,
        elementDmg: 0
      },

      // 攻撃
      attacks: {

        basic: {
          id: 'basic',
          name: '通常攻撃',
          type: 'basic',
          multiplier: 100,
          damageType: 'direct'
        },

        skill: {
          id: 'skill',
          name: '戦闘スキル',
          type: 'skill',
          multiplier: 200,
          damageType: 'direct'
        },

        ult: {
          id: 'ult',
          name: '必殺技',
          type: 'ult',
          multiplier: 300,
          damageType: 'direct'
        },

        talent: {
          id: 'talent',
          name: '天賦',
          type: 'talent',
          multiplier: 150,
          damageType: 'direct'
        }

      },

      // キャラクター固有バフ
      effects: [],

      // 星魂
      eidolons: {
        E1: [],
        E2: [],
        E3: [],
        E4: [],
        E5: [],
        E6: []
      },

      // 軌跡
      traces: {
        basic: 0,
        skill: 0,
        talent: 0,
        ult: 0
      }
    }

  },


  // ----------------------------------------
  // 光円錐
  // ----------------------------------------
  lightCones: {

    none: {
      id: 'none',
      name: '未装備',

      path: null,

      baseStats: {
        hp: 0,
        atk: 0,
        def: 0
      },

      effects: []
    },

clara_signature: {
  id: 'clara_signature',
  name: 'かけがえのないもの',

  path: '壊滅',

  baseStats: {
    hp: 1164,
    atk: 582,
    def: 396
  },

  superimposition: {
    S1: {
      atkPercent: 24,
      healPercent: 8,
      damagePercent: 24
    },

    S2: {
      atkPercent: 28,
      healPercent: 9,
      damagePercent: 28
    },

    S3: {
      atkPercent: 32,
      healPercent: 10,
      damagePercent: 32
    },

    S4: {
      atkPercent: 36,
      healPercent: 11,
      damagePercent: 36
    },

    S5: {
      atkPercent: 40,
      healPercent: 12,
      damagePercent: 40
    }
  },

  effects: [
    {
      id: 'family',
      name: '家族',
      type: 'conditional',

      conditions: [
        'enemyDefeated',
        'ownerHit'
      ],

      duration: 'untilNextTurn',

      stackable: false,

      triggerLimit: 'oncePerTurn'
    }
  }
},


  // ----------------------------------------
  // 遺物セット
  // ----------------------------------------
  relicSets: {

    none: {
      id: 'none',
      name: '未装備',
      effects: []
    }

  },


  // ----------------------------------------
  // オーナメント
  // ----------------------------------------
  ornaments: {

    none: {
      id: 'none',
      name: '未装備',
      effects: []
    }

  },


  // ----------------------------------------
  // バフ
  // ----------------------------------------
  buffs: {

    none: {
      id: 'none',
      name: 'なし'
    }

  },


  // ----------------------------------------
  // 敵
  // ----------------------------------------
  enemies: {

    standard: {
      id: 'standard',
      name: '標準敵',

      level: 95,

      stats: {
        hp: 0,
        def: 0,
        resistance: 0
      },

      weaknesses: [],

      effects: []
    }

  }

};

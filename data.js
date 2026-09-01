// キャラクター・光円錐・攻撃データをここへ追加していく設計です。
// 数値は現在「土台用」のサンプルです。実ゲームの全固有効果は次段階で実装します。
const HSR_DATA={
 characters:{
  gilgamesh:{name:'ギルガメッシュ',element:'雷',path:'壊滅',level:90,atk:3742,critRate:100,critDmg:150,speed:100,attacks:{basic:{name:'通常攻撃',multiplier:100},skill:{name:'戦闘スキル',multiplier:200},ult:{name:'必殺技',multiplier:300},talent:{name:'天賦',multiplier:150}}}
 },
 lightCones:{
  none:{name:'未装備',atk:0},sample:{name:'サンプル光円錐',atk:0}
 }
};

export const ICON_INDEX = {
  F0001: "🤣",
  F0002: "😂",
  F0003: "😊",
  F0004: "😇",
  F0005: "🥰",
  F0006: "😍",
  F0007: "😘",
  F0008: "😋",
  F0009: "😜",
  F0010: "🥺",
  I0001: "💕",
  I0002: "💖",
  I0003: "💗",
  I0004: "💓",
  I0005: "💞",
  S0001: "👍",
  S0002: "👏",
  S0003: "🙌",
};

export const mockPostDataList = [
  {
    id:"1",
    note:"最近はデジタルペイントに挑戦しています。色使いや構図を工夫して、見る人が楽しめる作品を目指しています。ご感想やアドバイスがあればぜひ教えてください！これからも色々なジャンルに挑戦していきたいです。",
    contentLink:"https://pbs.twimg.com/media/GMQKeJIaoAAhx9v?format=jpg",
    stumps:[
      {id:"F0006", number: 5},
      {id:"I0001", number: 3},
      {id:"S0001", number: 2}
    ],
    postDate: new Date()
  },{
    id:"2",
    note:"最近は水彩画に挑戦しています。柔らかい色合いを出すために、筆の使い方や水の加減に工夫しています。アドバイスがあればぜひ教えてください！",
    contentLink:"https://pbs.twimg.com/media/GKi6EmfbEAAfXKG?format=jpg",
    stumps:[
      {id:"F0002", number: 4},
      {id:"I0002", number: 2},
      {id:"S0002", number: 1}
    ],
    postDate: new Date()
  },{
    id:"3",
    note:"最近は油絵に挑戦しています。重厚感のある表現を目指して、色の重ね方や筆致に工夫しています。アドバイスがあればぜひ教えてください！",
    contentLink:"https://pbs.twimg.com/media/GKi6EmfbEAAfXKG?format=jpg",
    stumps:[
      {id:"F0003", number: 3},
      {id:"I0003", number: 2},
      {id:"S0003", number: 1}
    ],
    postDate: new Date()
  },{
    id:"4",
    note:"最近はアクリル画に挑戦しています。乾燥が早いので、色の重ね方に工夫が必要です。アドバイスがあればぜひ教えてください！",
    contentLink:"https://pbs.twimg.com/media/GKi6EmfbEAAfXKG?format=jpg",
    stumps:[
      {id:"F0004", number: 3},
      {id:"I0004", number: 2},
      {id:"S0004", number: 1}
    ],
    postDate: new Date()
  }
]

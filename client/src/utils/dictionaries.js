const nameDictionary = {
    pawn: {symbol:"歩", letter:"p"},
    tokin: {symbol:"と", letter:"t"},
    lance: {symbol:"香", letter:"l"},
    pLance: {symbol:"杏", letter:"x"},
    knight: {symbol:"桂", letter:"n"},
    pKnight: {symbol:"圭", letter:"h"},
    silver: {symbol:"銀", letter:"s"},
    pSilver: {symbol:"全", letter:"q"},
    gold: {symbol:"金", letter:"g"},
    bishop: {symbol:"角", letter:"b"},
    horse: {symbol:"馬", letter:"m"},
    rook: {symbol:"飛", letter:"r"},
    dragon: {symbol:"竜", letter:"d"},
    king: {symbol:"玉", letter:"k"}
}

const symbolDictionary = {
    "歩": {name:"pawn", letter:"p"},
    "と": {name:"tokin", letter:"t"},
    "香": {name:"lance", letter:"l"},
    "杏": {name:"pLance", letter:"x"},
    "桂": {name:"knight", letter:"n"},
    "圭": {name:"pKnight", letter:"h"},
    "銀": {name:"silver", letter:"s"},
    "全": {name:"pSilver", letter:"q"},
    "金": {name:"gold", letter:"g"},
    "角": {name:"bishop", letter:"b"},
    "馬": {name:"horse", letter:"m"},
    "飛": {name:"rook", letter:"r"},
    "竜": {name:"dragon", letter:"d"},
    "玉": {name:"king", letter:"k"}
}

const letterDictionary = {
    p: {symbol: "歩", name: "pawn"},
    t:　{symbol: "と", name: "tokin"},
    l:　{symbol: "香", name: "lance"},
    x: {symbol: "杏", name: "pLance"},
    n: {symbol: "桂", name: "knight"},
    h: {symbol: "圭", name: "pKnight"},
    s: {symbol: "銀", name: "silver"},
    q: {symbol: "全", name: "pSilver"},
    b: {symbol: "角", name: "bishop"},
    m: {symbol: "馬", name: "horse"},
    r: {symbol: "飛", name: "rook"},
    d: {symbol: "竜", name: "dragon"},
    g: {symbol: "金", name: "gold"},
    k: {symbol: "玉", name: "king"}
};

export {nameDictionary, symbolDictionary, letterDictionary};
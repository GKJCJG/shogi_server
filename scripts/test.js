const now = new Date(Date.now());
console.log(now);

const year = now.getFullYear();
const day = now.getDate();
const month = now.getMonth();

console.log(day, month, year);

const before = new Date(year, -1, day);
console.log(before);


const val1 = "Rs. 2,87,330";
const val2 = "₹ 2,43,500.50";

function parseMoney(str) {
  const match = str.match(/[\d,]+(\.\d+)?/);
  return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
}

console.log(parseMoney(val1));
console.log(parseMoney(val2));

const val1 = "Rs. 2,87,330";
console.log(val1.replace(/[^0-9.]+/g, ""));
console.log(parseFloat(val1.replace(/[^0-9.]+/g, "")));

const val2 = "Rs. 0.29"; // ??
console.log(val2.replace(/[^0-9.]+/g, ""));


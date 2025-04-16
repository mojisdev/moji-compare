import { coerce, compare } from "./src/index";

console.log(compare("1.0.0", "1.0.0", "=")); // true
console.log(compare("1.0.0", "1.0.1", "<")); // true
console.log(compare("1.0.0", "1.0.1", ">")); // false
console.log(compare("1.0.0", "1.0.0", "<=")); // true
console.log(compare("1.0.0", "1.0.0", ">=")); // true
console.log(compare("1.2.-3a", "1.0.0", ">")); // false
console.log(coerce("invalid"));

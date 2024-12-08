import fs from 'node:fs';

const numRegEx = /\d+/g;

const generateBoolCombos = (x) => {
  const permutations = 2 ** x;
  const combos = [];
  for (let i = 0; i < permutations; i++) {
    const combo = [];
    for (let bit = 0; bit < x; bit++) {
      combo.push(Boolean(i & (1 << bit)));
    }
    combos.push(combo);
  }
  return combos;
}

const ADD_OP = "add", MUL_OP = "mul", CON_OP = "con"

const generateTriCombos = (x) => {
  const states = [ADD_OP, MUL_OP, CON_OP];
  const permutations = 3 ** x;
  const combos = [];
  for (let i = 0; i < permutations; i++) {
    const combo = [];
    var value = i;
    for (let bit = 0; bit < x; bit++) {
      combo.push(states[value % 3]);
      value = Math.floor(value / 3);
    }
    combos.push(combo);
  }
  return combos;
}

const parseEqs = (text) => {
  const eqs = [];
  const lines = text.split(/\n/);
  for (const line of lines) {
    const nums = line.match(numRegEx);
    if (nums && nums.length > 0) {
      const eq = {
        product: parseInt(nums.shift()),
        values: [...nums]
      }
      eqs.push(eq);
    }
  }
  return eqs;
}

const add = (a, b) => {
  return parseInt(a) + parseInt(b);
}

const mul = (a, b) => {
  return parseInt(a) * parseInt(b);
}

const con = (a, b) => {
  return [a, b].join("");
}

const debugEquation = (eq, combo) => {
  const strings = [];
  strings.push("product: " + eq.product);
  const vals = eq.values;
  for (let i = 0; i < vals.length; i++) {
    strings.push(`${vals[i]}`)
    if (i < vals.length - 1) {
      strings.push(`${combo[i] ? "+" : "*"}`);
    }
  }
  console.log(strings.join(" "))
}

const concatValues = (eq, combo) => {
  const parse = [...eq.values];
  const parsed = [];
  for (let i = 1; i < combo.length; i++) {
    if (combo[i-1] == CON_OP) {
       const conVals = parse.splice(0, 2);
       parsed.push(conVals.join(""));
    } else {
      parsed.push(parse.shift());
    }
  }
  return parsed;
}

const tryBoolCombos = (eqs) => {
  const passed = [];
  for (const eq of eqs) {
    var {values} = eq;
    const combos = generateBoolCombos(values.length - 1);
    for (const combo of combos) {
      var result = values[0];
      for (let i = 0; i < combo.length; i++) {
        const num = values[i + 1];
        if (combo[i]) {
          result = add(result, num);
        } else {
          result = mul(result, num);
        }
      }
      if (result == eq.product) {
        passed.push([eq, combo]);
        break;
      } else if (result < eq.product) {
        continue;
      }
    }
  }
  return passed;
}

const tryTriCombos = (eqs, combos) => {
  const passed = [];
  for (const eq of eqs) {
    var {values} = eq;
    for (const combo of combos) {
      var result = values[0];
      for (let i = 0; i < combo.length; i++) {
        const num = values[i + 1];
        var op = combo[i]
        if (op == ADD_OP) {
          result = add(result, num);
        } else  if (op == MUL_OP) {
          result = mul(result, num);
        } else if (op == CON_OP) {

        }
      }
      if (result == eq.product) {
        passed.push([eq, combo]);
        break;
      } else if (result < eq.product) {
        continue;
      }
    }
  }
  return passed;
}

const sumResults = (passed) => {
  var result = 0;
  for (const eq of passed) {
    debugEquation(eq[0], eq[1]);
    result += eq[0].product;
  }
  return result;
}

const firstTask = (text) => {
  const eqs = parseEqs(text);
  const passed = tryBoolCombos(eqs);
  console.log("First: %d", sumResults(passed));
}

const secondTask = (text) => {
  const eqs = parseEqs(text);
  const combos = generateTriCombos(eqs.length);
  const finalEqs = [];
  for (const eq of eqs) {
    finalEqs.push(concatValues(eq, combos[i]));
  }
  const passed = tryTriCombos(finalEqs, combos);
  console.log("Second: %d", sumResults(passed));
}

fs.readFile('./2024/7/input.txt', 'utf-8',
  (err, text) => {
    if (err) {
      console.error(err);
    }
    firstTask(text);
    secondTask(text);
})
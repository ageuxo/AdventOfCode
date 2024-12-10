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
    if (combo.length > 0 && !(combo.length == 1 && combo[0] == CON_OP)) {
      combos.push(combo);
    }
  }
  if (combos.length > 0) {
    return combos;
  }
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
  return parseInt([a, b].join(""));
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

const flatten = (eq, combo) => {
  const vals = [...eq.values];
  const flatValues = [];
  const flatCombo = [];
  while (combo.length > 0) {
    const op = combo.shift();
    var flatValue;
    if (op == CON_OP) {
      const a = vals.shift();
      const b = vals.shift();
      flatValue = con(a, b);
    } else {
      flatCombo.push(op);
      flatValue = vals.shift();
    }
    flatValues.push(flatValue);
  }

  if (flatCombo.length > 0 && flatValues.length > 1) {
    return {
      product: eq.product,
      values: [...flatValues],
      flatCombo: flatCombo
    }
  }
}

const makeFlatEqCombosArrs = (eqs) => {
  const eqCombos = [];
  for (let i = 0; i < eqs.length; i++) {
    const eq = eqs[i];
    const combos = generateTriCombos(eq.values.length - 1);
    const flattenedEqs = [];
    for (let j = 0; j < combos.length; j++) {
      const eq = eqs[i];
      const combo = combos[j];
      const flattened = flatten(eq, combo);
      if (flattened) {
        flattenedEqs.push(flattened);
      }
    }
    if (flattenedEqs.length > 0) {
      eqCombos.push([...flattenedEqs])
    };
  }
  return eqCombos;
}

const tryTriCombos = (eqs) => {
  const eqCombosArrs = makeFlatEqCombosArrs(eqs);
  const passed = [];
  for (const arr of eqCombosArrs) {
    combo: for (const eqCombo of arr) {
      const {product, values, flatCombo} = eqCombo;
      var result = values[0];
      for (let i = 0; i < flatCombo.length; i++) {
        const num = values[i + 1];
        if (flatCombo[i]) {
          result = add(result, num);
        } else {
          result = mul(result, num);
        }
      }
      if (result == product) {
        passed.push([eqCombo, flatCombo]);
        break combo;
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
  const passed = tryTriCombos(eqs);
  console.log("Second: %d", sumResults(passed));
}

fs.readFile('./2024/7/test.txt', 'utf-8',
  (err, text) => {
    if (err) {
      console.error(err);
    }
    firstTask(text);
    secondTask(text);
})
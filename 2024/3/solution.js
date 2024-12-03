import fs from "node:fs";

const mulFind = /mul[(]\d+,\d+[)]/g;
const instructionFind = /mul[(]\d+,\d+[)]|(do[(][)]|don't[(][)])/g;

const findMult = (text) => {
  const mulArr = text.match(mulFind);
  return mulArr;
}

const parseMults = (multArr) => {
  return multArr.map((el)=> el.match(/\d+/g))
}

const isCondition = (str) => {
  return str.match(/(do[(][)]|don't[(][)])/);
}

const parseInstructions = (text) => {
  var instrArr = text.match(instructionFind);
  var mulEnabled = true;
  var blocks = [];
  while (instrArr.length > 0) {
    var condIdx = instrArr.findIndex(isCondition);
    var instr = instrArr.splice(condIdx, 1)[0];
    var block = instrArr.splice(0, condIdx);
    if (mulEnabled) {
      blocks.push(block);
    }
    if (instr.match(/do[(][)]/)) {
      mulEnabled = true;
    } else {
      mulEnabled = false;
    }
  }
  return blocks.flat(1);
}


const multsAdd = (mults) => {
  var result = 0;
  mults.forEach((mult)=> {
    result += (mult[0] * mult[1]);
  })
  return result;
}

const firstTask = (text) => {
  var multsArr = findMult(text);
  var mults = parseMults(multsArr);
  console.log("First: %d", multsAdd(mults));
}

const secondTask = (text) => {
  var multArr = parseInstructions(text);
  var mults = parseMults(multArr);
  console.log("Second: %d", multsAdd(mults));
}

fs.readFile('./2024/3/input.txt', 'utf-8',
  (err, text) => {
    if (err) {
      console.error(err);
    }
    firstTask(text);
    secondTask(text);
  })
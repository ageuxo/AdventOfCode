import fs from "node:fs";

const ruleRegEx = /\d+\|\d+/gm;
const updateRegEx = /\d+(?:,\d+)+/gm;

const rules = [];
const updates = [];

const parseRules = (text) => {
  const ruleLines = text.match(ruleRegEx);
  const parsed = ruleLines.map((line)=>line.split("|"));
  rules.push(...parsed);
}

const parseUpdates = (text) => {
  const updateLines = text.match(updateRegEx);
  const parsed = updateLines.map((line)=>line.split(","));
  updates.push(...parsed);
}

const ruleCompare = (a, b) => {
  for (const rule of rules) {
    if (rule.includes(a) && rule.includes(b)) {
      if (rule[0] == a && rule[1] == b) {
        return -1;
      } else if (rule[0] == b && rule[1] == a) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  return 0;
}

const verify = (updateArr) => {
  for (let i = 0; i < updateArr.length; i++) {
    const page = updateArr[i];
    for (const rule of rules) {
      if (rule[0] == page) {
        if (updateArr.includes(rule[1])) {
          if (!(updateArr.indexOf(rule[1]) > i)) {
            return false;
          }
        }
      }
    }
  }
  return true;
}

const addMiddlePageNums = (verified) => {
  var result = 0;
  for (const update of verified) {
    result += Number.parseInt(update.at(Math.floor(update.length / 2)))
  }
  return result;
}

const getVerified = () => {
  const verified = [];
  for (const update of updates) {
    if (verify(update)) {
      verified.push(update);
    }
  }
  return verified;
}

const getSortedWrongs = () => {
  const wrongs = [];
  for (const update of updates) {
    if (!verify(update)) {
      wrongs.push(update);
    }
  }

  for (const wrong of wrongs) {
    wrong.sort(ruleCompare);
  }

  return wrongs;
}

const firstTask = () => {
  console.log("First: %d", addMiddlePageNums(getVerified()));
}

const secondTask = () => {
  console.log("Second: %d", addMiddlePageNums(getSortedWrongs()))
}

fs.readFile('./2024/5/input.txt', 'utf-8',
  (err, text) => {
    if (err) {
      console.error(err);
    }
    parseRules(text);
    parseUpdates(text);
    firstTask();
    secondTask();
  })
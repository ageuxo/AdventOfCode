const numSort = (a, b) => {
  return a-b;
}

const compareNum = (a, b) => {
  var result = a - b;
  if (result < 0) {
    result = -result;
  }
  return result;
}

const getListsObj = (text) => {
  const lines = text.split(/\n/)
  var left = [];
  var right = [];
  for (const line of lines) {
    const values = line.match(/\S+/g);
    if (!values) {
      break;
    }
    left.push(values[0]);
    right.push(values[1]);
  }

  return {
    l: left,
    r: right
  }
}

const compareLists = (listsObj) => {
  listsObj.l.sort(numSort);
  listsObj.r.sort(numSort);

  var ret = [];
  for (var i = 0; i < listsObj.l.length; i++) {
    const left = listsObj.l[i];
    const right = listsObj.r[i];

    ret.push(compareNum(left, right));
  }
  return ret;
}

const addAll = (numArr) => {
  var ret = 0;
  for (const num of numArr) {
    ret += num;
  }
  return ret;
}

const occurancesInList = (num, list) => {
  var ret = 0;
  for (const element of list) {
    if (element == num) {
      ret++;
    }
  }
  return ret;
}

const compareListsAgain = (listsObj) => {
  var ret = [];
  for (var i = 0; i < listsObj.l.length; i++) {
    const num = listsObj.l[i];
    const list = listsObj.r;

    ret.push(num * occurancesInList(num, list));
  }
  return ret;
}

const firstTask = (text) => {
  var listsObj = getListsObj(text);
  var compared = compareLists(listsObj);
  console.log("First= %d", addAll(compared));
}

const secondTask = (text) => {
  var listsObj = getListsObj(text);
  var compared = compareListsAgain(listsObj);
  console.log("Second= %d", addAll(compared));
}

import fs from 'node:fs';

fs.readFile('./2024/1/input.txt', 'utf-8',
  (err, file) => {
    if (err) {
      console.error(err);
    }
    firstTask(file);
    secondTask(file);
})
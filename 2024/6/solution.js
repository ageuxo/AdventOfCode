import fs from "node:fs";

const rowRegEx = /.+/g;
const guardRegEx = /[><v^]/g;
var map;

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const getRelativePos = (posVec, dirVec) => {
  return new Vec(posVec.x + dirVec.x, posVec.y + dirVec.y);
}

const UP = new Vec(0, -1);
const DOWN = new Vec(0, 1);
const LEFT = new Vec(-1, 0);
const RIGHT = new Vec(1, 0);
const DIRS = [["^", UP], [">", RIGHT], ["v", DOWN], ["<", LEFT]];

const dirRot90 = (dir) => {
  switch (dir) {
    case UP:
      return RIGHT;
    case RIGHT:
      return DOWN;
    case DOWN:
      return LEFT;
    case LEFT:
      return UP;
    default:
      return;
  }
}

class Map {
  constructor(rows) {
    this.rows = rows;
    this.rowLength = rows[0].length;
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      var x;
      for (const dir of DIRS) {
        x = row.indexOf(dir[0]);
        if (x >= 0) {
          this.guardDir = dir[1];
          break;
        }
      }

      if (x >= 0) {
        this.guardPos = new Vec(x, y);
        break;
      }
    }
  }

  /**
   * Get row
   */
  getRow(y) {
    if (y < this.rows.length) {
      return this.rows.at(y);
    }
  }

  /**
   * Get value at coordinate
   */
  get(x, y) {
    const row = this.getRow(y);
    if (!row) {
      return;
    }
    if (x < row.length && x >= 0) {
      return row.at(x);
    }
  }

  getVec(vec) {
    if (vec) {
      return this.get(vec.x, vec.y);
    }
  }

  getRelative(posVec, dirVec) {
    return this.getVec(getRelativePos(posVec, dirVec));
  }
}

const parseMap = (text) => {
  const rows = text.match(rowRegEx);
  map = new Map(rows);
}

const arrContainsVec = (arr, vec) => {
  for (const el of arr) {
    if (el.x == vec.x && el.y == vec.y) {
      return true;
    }
  }
  return false;
}

const arrAddVecIfUnique = (arr, vec) => {
  if (!arrContainsVec(arr, vec)) {
    arr.push(vec);
  }
}

const arrContainsTurn = (arr, pos, dir) => {
  for (const el of arr) {
    if (el[0].x == pos.x && el[0].y == pos.y &&
      el[1].x == dir.x && el[1].y == dir.y
    ) {
      return true;
    }
  }
  return false;
}

const traverse = (passedArr, pos, dir) => {
  arrAddVecIfUnique(passedArr, pos);
  var nextPos = getRelativePos(pos, dir);
  var next = map.getVec(nextPos);
  if (next) {
    if (next.match("#")) {
      return [pos, dirRot90(dir)];
    } else {
      return traverse(passedArr, nextPos, dir);
    }
  }
}

const debugMap = (passedSet) => {
  const rows = [];
  for (const row of map.rows) {
    rows.push(row.split(""));
  }
  for (const pos of passedSet) {
    var {x, y} = pos;
    var currentChar = rows[y][x];
    if (currentChar == "." || currentChar.match(/[><v^]/g)) {
      rows[y][x] = "1";
    } else {
      rows[y][x] = `${parseInt(currentChar) + 1}`;
    }
  }
  const dbgRows = [];
  for (const row of rows) {
    dbgRows.push(row.join(""));
  }
  fs.writeFileSync('./2024/6/debug.txt', dbgRows.join("\n"), 
    () => {
      console.log("File callback")
    }
  );
}

const firstTask = () => {
  const passedSpaces = [];
  var dir = map.guardDir;
  var pos = map.guardPos;
  var turns = 0;
  var result = traverse(passedSpaces, pos, dir);
  while (result) {
    [pos, dir] = result;
    turns++;
    result = traverse(passedSpaces, pos, dir);
    if (turns > 800) {
      console.log("Turns reached %d. Breaking...", turns);
      break;
    }
  }
  debugMap(passedSpaces);
  console.log("First: %d", passedSpaces.length);
}

const skipRegEx = /[><v^#]/g;

const secondTask = () => {
  var loopPosArr = [];

  const txtRows = map.rows;
  for (let y = 0; y < txtRows.length; y++) {
    var rowLength = txtRows[y].length;
    for (let x = 0; x < rowLength; x++) {
      var testRows = [...map.rows];
      var row = txtRows[y].split("");
      if (row[x].match(skipRegEx) || txtRows[y][x].match(guardRegEx)) {
        continue;
      } else {
        row[x] = "#";
        testRows[y] = row.join("");
        map = new Map(testRows);

        var turns = [];
        var passedSpaces = [];
        var dir = map.guardDir;
        var pos = map.guardPos;
        var lastPos;
        var lastDir;
        var result = traverse(passedSpaces, pos, dir);
        while (result) {
          [pos, dir] = result;
          if (arrContainsVec(turns, pos)) {
            //arrAddVecIfUnique(loopPosArr, new Vec(x, y));
            debugMap(passedSpaces);
            loopPosArr.push(new Vec(x, y));
            break;
          } else {
            turns.push(pos);
          }
          lastPos = pos;
          lastDir = dir;
          result = traverse(passedSpaces, pos, dir);
        }
      }
    }
  }
  console.log("Second: %d", loopPosArr.length)
}

fs.readFile('./2024/6/test.txt', 'utf-8',
  (err, text) => {
    if (err) {
      console.error(err);
    }
    parseMap(text);
    firstTask();
    secondTask();
  })
import fs from "node:fs";

class SearchVector {
  constructor(name, rowDir, colDir) {
    this.name = name;
    this.rowDir = rowDir;
    this.colDir = colDir;
  }
}

const vecRight = new SearchVector("right", 0, 1);

const vecDown = new SearchVector("down", 1, 0)

const vecDiagD = new SearchVector("diagD", 1, 1)
const vecDiagU = new SearchVector("diagU", -1, 1)

const rowRegEx = /.+/g

const makeRows = (text) => {
  return text.match(rowRegEx);
}

const reverseRows = (rows) => {
  const reversedRows = [];
  for (const row of rows) {
    const chars = row.split("");
    chars.reverse();
    reversedRows.push(chars.join(""));
  }
  return reversedRows.reverse();
}

const searchInDirAt = (rows, string, x, y, {rowDir, colDir}) => {
  var found = 0;
  for (let i = 0; i < string.length; i++) {
    const letter = string.at(i);
    const rowPos = i * rowDir + x;
    const colPos = i * colDir + y;
    if (rows.length > rowPos && rowPos >= 0 && rows[rowPos].length > colPos) {
      const checkLetter = rows[rowPos].at(colPos);
      if (checkLetter != letter) {
        break;
      } else {
        if (i == string.length - 1) {
          found++;
        }
        continue;
      }
    }
  }
  return found;
}

const searchInDir = (rows, string, SearchVector) => {
  var found = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    for (let j = 0; j < row.length; j++) {
      const col = row[j];
      found += searchInDirAt(rows, string, i, j, SearchVector);
    }
  }
  console.log("Found %s: %d",SearchVector.name, found);
  return found;
}

const firstTask = (text) => {
  const rows = makeRows(text);
  var found = searchInDir(rows, "XMAS", vecRight);
  found += searchInDir(rows, "XMAS", vecDown);
  found += searchInDir(rows, "XMAS", vecDiagD);
  found += searchInDir(rows, "XMAS", vecDiagU);
  const reversedRows = reverseRows(rows);
  found += searchInDir(reversedRows, "XMAS", vecRight);
  found += searchInDir(reversedRows, "XMAS", vecDown);
  found += searchInDir(reversedRows, "XMAS", vecDiagD);
  found += searchInDir(reversedRows, "XMAS", vecDiagU);
  console.log("First: %d", found);
}

fs.readFile('./2024/4/input.txt', 'utf-8',
  (err, text) => {
    if (err) {
      console.error(err);
    }
    firstTask(text);
  })
import fs from 'node:fs';

const getReports = (text) => {
  var reports = text.split(/\n/);
  for (let i = 0; i < reports.length; i++) {
    const element = reports[i];
    reports[i] = element.split(/\s+/).filter((s) => s.match(/\S/)).map((s) => parseInt(s));
  }
  return reports;
}

const ensureSafe = (report) => {
  if (report.length < 1) {
    return false;
  }
  var lastElement = report[0];
  var dir = null;
  for (let i = 1; i < report.length; i++) {
    const element = report[i];
    var diff = lastElement - element;
    if (diff >= 1 && diff <= 3) {
      if (dir) {
        if (dir != "INCR") {
          return false;
        }
      } else {
        dir = "INCR";
      }
    } else if (diff <= -1 && diff >= -3) {
      if (dir) {
        if (dir != "DECR") {
          return false;
        }
      } else {
        dir = "DECR";
      }
    } else {
      return false;
    }
    lastElement = element;
  }
  return true;
}

const getSafeReports = (reports) => {
  var safeReports = [];
  for (const report of reports) {
    if (ensureSafe(report)) {
      safeReports.push(report);
    } else {
      for (let i = 0; i < report.length; i++) {
        var tempCopy = [...report]
        tempCopy.splice(i, 1);
        if (ensureSafe(tempCopy)) {
          safeReports.push(tempCopy);
          break;
        }
      }
    }
  }
  
  return safeReports;
}

const firstTask = (text) => {
  var reports = getReports(text);
  var safeReports = getSafeReports(reports);
  console.log(safeReports.length);
}

console.log("hello?")
fs.readFile('./2024/2/input.txt', 'utf-8',
  (err, text) => {
    if (err) {
      console.error(err);
    }
    firstTask(text);
  })
var fs = require('fs');
var path = require('path');

module.exports = function (baseFile, format) {
  var base = new Base(baseFile);
  if (format) base.format = format;
  while (!base.completed) {
    base.replace();
  }
  return base.content;
};

function Base (baseFile) {
  this.content = fs.readFileSync(baseFile, 'utf8');
  this.baseDir = path.dirname(baseFile);
  this.format = /{{(.*?)}}/g;
  this.completed = false;
}

Base.prototype.replace = function () {
  var draftList = [];
  var repPath = this.format.exec(this.content);
  if (repPath == null) {
    this.completed = true;
    return;
  }

  while (repPath !== null) {
    var repFullPath = path.resolve(this.baseDir, repPath[1]);
    var draft = new Draft();
    draft.snippet = fs.readFileSync(repFullPath, 'utf8');
    draft.path = repPath[0];
    draftList.push(draft);
    repPath = this.format.exec(this.content);
  }

  for (i = 0; i < draftList.length; i++) {
    var draft = draftList[i];
    this.content = this.content.replace(draft.path, draft.snippet);
  }
}

function Draft() {
  this.path;
  this.snippet;
}
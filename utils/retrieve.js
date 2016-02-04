var fs = require('fs');
var path = require('path');

module.exports = function (baseFile, format) {
  var source = new Source(baseFile);
  if (format) source.format = format;
  while (!source.completed) {
    source.replace();
  }
  return source.content;
};

function Source (baseFile) {
  this.content = fs.readFileSync(baseFile, 'utf8');
  this.baseDir = path.dirname(baseFile);
  this.format = /{{(.*?)}}/g;
  this.completed = false;
}

Source.prototype.replace = function () {
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
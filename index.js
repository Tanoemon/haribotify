var Transform = require('stream').Transform,
  util = require('util'),
  retrieve = require('./utils/retrieve'),
  toJsString = require('./utils/toJsString');

module.exports = function (filename, opts) {
  return new Haribotify(filename);
};

util.inherits(Haribotify, Transform);

function Haribotify (filename) {
  Transform.call(this);
  this._filename = filename;
  this._data = '';
}

Haribotify.prototype._transform = function (buf, enc, callback) {
  this._data += buf;
  callback();
};

Haribotify.prototype._flush = function (callback) {
  if (this._data.indexOf('<') !== 0) {
    this.push(this._data);
    callback();
    return;
  }
  try {
    var text = retrieve(this._filename);
    var jsText = toJsString(text);
    var result = 'module.exports = ' + jsText + ';'
    this.emit('haribotify', result);
    this.push(result);
  } catch (err) {
    this.emit('error', err);
    return;
  }
  callback();
};
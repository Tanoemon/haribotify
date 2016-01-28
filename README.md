# haribotify

A [Browserify](http://browserify.org) transform which merges HTML files and require it.

## Installation

``` bash
npm install --save-dev haribotify
```

## Usage

### CLI

```sh
  $ browserify script.js -o bundle.js -t [ haribotify ]
```

### Node

``` javascript
var fs = require("fs");
var browserify = require("browserify");
browserify("./script.js")
  .transform("haribotify")
  .bundle()
  .pipe(fs.createWriteStream("bundle.js"));
```

Require html files:
``` javascript
var html = require('./html/base.html');
```

Then the index.html is automatically transformed:
#### ./html/base.html
``` html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>This is base</title>
  </head>
  <body>
    {{./components/main.html}}
  </body>
</html>
```
**NOTE:** The root path of components is where thier base html file (index.html in this case) is placed.

#### ./html/components/main.html
``` html
<div>This is the main component</div>
```

to:

``` html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>This is base</title>
  </head>
  <body>
    <div>This is the main component</div>
  </body>
</html>
```
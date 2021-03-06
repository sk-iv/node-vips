#!/usr/bin/env node

'use strict';

/*
 * Thumbnail many images, either from a file source or memory buffer.
 *
 * It runs in a fairly steady 1gb of ram for me. Watching the output, you see
 * stuff like:
 *
 * file processing /data/john/pics/sample/7350.jpg
 * (2896 vips objects known to node-vips)
 * file processing /data/john/pics/sample/7351.jpg
 * (6 vips objects known to node-vips)
 * file processing /data/john/pics/sample/7352.jpg
 * (11 vips objects known to node-vips)
 * file processing /data/john/pics/sample/7353.jpg
 * (16 vips objects known to node-vips)
 *
 * So when around 3000 vips objects are alive, the node gc runs and they all get
 * flushed.
 *
 * If you want it to run in less ram than that, you'll need to expose the gc and
 * trigger it manually every so often.
 */

var fs = require('fs');
var vips = require('..');

// benchmark thumbnail via a memory buffer
function viaMemory (filename, thumbnailWidth) {
  var data = fs.readFileSync(filename);

  var thumb = vips.Image.thumbnailBuffer(data, thumbnailWidth, {crop: 'centre'});

  // don't do anything with the result, this is just a test
  thumb.writeToBuffer('.jpg');
}

/*
// benchmark thumbnail via files
function viaFiles (filename, thumbnailWidth) {
  var thumb = vips.Image.thumbnail(filename, thumbnailWidth, {crop: 'centre'});

  thumb.writeToBuffer('.jpg');
}
 */

for (let filename of process.argv.slice(2)) {
  console.log('processing' + filename + ', nObjects = ' + vips.nObjects);
  viaMemory(filename, 500);
}

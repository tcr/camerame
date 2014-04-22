#!/usr/bin/env node

var util = require('util');
var common = require('./common');
var nomnom = require('nomnom');
var fs = require('fs');
var open = require('open');

// Test function.
function tester (next)
{
  // Command line options.
  var opts = nomnom
    .options({
      status: {
        position: 0,
        default: 200
      }
    })
    .parse();

  // Test criteria.
  var statusCode = parseInt(opts.status);

  // Run test.
  common.runScript(false, function (err, client) {
    // Listen in.
    client.stdout.pipe(process.stdout);
    client.stderr.pipe(process.stderr);

    // Commands.
    var status = false;
    // client.send({
    //   statusCode: statusCode
    // });
    client.on('message', function (res) {
      var p = 'images/' + (new Date).toJSON() + '.jpg';
      fs.writeFileSync(p, res);
      open(p);
      console.error(p);
    })
    client.on('script-stop', function () {
      next(err, status);
    });
  });
}


// Public API.
exports.tester = tester;

// Run script directly.
if (require.main == module) {
  console.error('connecting to tessel...'.grey)
  exports.tester(function (err, status) {
    console.log(util.format('success: %s').grey, status);
    if (err) throw err;
  });
}
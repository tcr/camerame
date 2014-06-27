var tessel = require('tessel');

require('colorsafeconsole')(console);
require('colors');

function runScript (verbose, next)
{
  tessel.findTessel(null, function (err, client) {
    // client.listen(true, [10, 11, 12, 13, 20, 21, 22])

    if (err) {
      console.error('No tessel connected, aborting:', err);
      process.exit(1);
    }
    
    verbose && client.on('command', function (command, data, debug) {
      console.log(debug ? command.grey : command.red, String(typeof data == 'string' ? data : JSON.stringify(data)).grey);
    });

    // Log errors.
    client.on('error', function (err) {
      console.error('Error: Cannot connect to Tessel locally.', err);
    })

    // Bundle and upload code.
    console.error('uploading tessel code...'.grey);
    client.run(__dirname + '/tessel/index.js', [], {}, function (err, bundle) {
      // When this script ends, stop the client.
      client.once('script-stop', function (code) {
        console.log('stopped.'.grey);
        client.end();
      });

      // Handle running script.
      next(err, client);
    });
  });
}

exports.runScript = runScript;

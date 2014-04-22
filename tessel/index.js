var tessel = require('tessel');

var port = tessel.port['A'];

process.ref();

tessel.led[1].writeSync(1);
var camera = require('camera-vc0706').use(port, function(err) {
  if (err) {
    return console.log(err);
  }
  else {
    tessel.led[2].writeSync(1);
    camera.setResolution('vga', function(err) {
      if (err) console.log("Error setting resolution", err);
      console.log("Resolution set!");
      tessel.led[3].writeSync(1);
      camera.setCompression(0, function(err) {
        if (err) console.log("Error setting compression", err);
        console.log("Compression set!")
        tessel.led[1].writeSync(1);
        tessel.led[2].writeSync(1);
        tessel.led[3].writeSync(1);
        tessel.led[4].writeSync(1);
        setImmediate(function go () {
          camera.takePicture(function(err, image) {
            if (err) {
              console.log("error taking image", err);
              // setImmediate(go);
              process.unref()
            }
            else {
              console.log("picture result", image.length);
              // setImmediate(go);
              process.send(image);
              process.unref()
            }
          });
        });
      });
    });
  }
});

camera.on('ready', function() {
  console.log("We're ready!");
});

camera.on('error', function(err) {
  console.log("Error connecting", err);
})

camera.on('picture', function(image) {
  console.log("Took a picture", image);
  tessel.led[1].writeSync(0);
  tessel.led[2].writeSync(0);
  tessel.led[3].writeSync(0);
  tessel.led[4].writeSync(0);
  process.send(image);
});

camera.on('resolution', function(resolution) {
  console.log("Resolution was set!", resolution);
});

camera.on('compression', function(compression) {
  console.log("Resolution was set!", compression);
})


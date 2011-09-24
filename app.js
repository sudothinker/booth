(function() {
  var app, exec, express, sys;
  express = require('express');
  sys = require('sys');
  exec = require('child_process').exec;
  app = module.exports = express.createServer();
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.compiler({
      src: __dirname + '/public',
      enable: ['sass']
    }));
    app.use(app.router);
    return app.use(express.static(__dirname + '/public'));
  });
  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure('production', function() {
    return app.use(express.errorHandler());
  });
  app.get('/', function(req, res) {
    return res.render('index', {
      title: 'Express'
    });
  });
  app.post('/snap', function(req, res) {
    var child;
    child = exec('gphoto2 --capture-image-and-download --filename capture%y%m%d%H%M%S.jpg --frames ' + req.body.frames + ' --interval ' + req.body.interval, function(error, stdout, stderr) {
      sys.print('stdout: ' + stdout);
      return sys.print('stderr: ' + stderr);
    });
    return res.redirect('/');
  });
  if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port);
  }
}).call(this);

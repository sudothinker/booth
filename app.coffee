express = require('express')
sys = require('sys')
exec = require('child_process').exec;
app = module.exports = express.createServer()

# Configuration

app.configure(() ->
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
)

app.configure('development', () ->
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
)

app.configure('production', () ->
  app.use(express.errorHandler()); 
)

# Routes
app.get('/', (req, res) ->
  res.render('index', {
    title: 'Express'
  });
)

app.post('/snap', (req, res) ->
  child = exec('gphoto2 --capture-image-and-download --filename capture%y%m%d%H%M%S.jpg --frames ' + req.body.frames + ' --interval ' + req.body.interval, (error, stdout, stderr) ->
    sys.print('stdout: ' + stdout)
    sys.print('stderr: ' + stderr)
  )
  res.redirect('/');
)

# Only listen on $ node app.js

unless module.parent
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);

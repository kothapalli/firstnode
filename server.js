var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');

app.use(express.bodyParser());

var graphData = new Array(20,30,40,50,60,70,80,70,60,50,40,30,20);
var j = 0;

//GLOBAL BROADCAST TO ALL CLIENTS
setInterval(function() {
    if(j>=graphData.length) j = 0;
    var x = (new Date()).getTime();
    var y = graphData[j];
    j++;
    io.sockets.emit('global', {hello: 'super msg', x:  x, y: y});
}, 2000);

//INDIVIDUAL CLIENTS
io.sockets.on('connection', function (socket) {
    var i = 0;
    console.log("connected");
    /*
    setInterval(function() {
        if(i>=graphData.length) i = 0;
        var random = Math.round(Math.random() * 100);
        var x = (new Date()).getTime();
        var y = graphData[i];
        i++;
        socket.emit('individual', { hello: 'world', x:  x, y: y});
    }, 1000);
    */
    socket.on('my other event', function (data) {
        console.log(data);
    });
});



// Register ejs as .html. If we did
// not call this, we would need to
// name our views foo.ejs instead
// of foo.html. The __express method
// is simply a function that engines
// use to hook into the Express view
// system by default, so if we want
// to change "foo.ejs" to "foo.html"
// we simply pass _any_ function, in this
// case `ejs.__express`.

app.engine('.html', require('ejs').__express);

// Optional since express defaults to CWD/views

app.set('views', __dirname + '/views');

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

// Dummy users
var users = [
    { name: 'tobi', email: 'tobi@learnboost.com' },
    { name: 'loki', email: 'loki@learnboost.com' },
    { name: 'jane', email: 'jane@learnboost.us' }
];

app.get('/', function(req, res){
    res.render('users', {
        users: users,
        title: "EJS example",
        header: "Some users"
    });
});

app.get('/graph/', function(req, res){
    res.render('graph', {
        users: users
    });
});

app.get('/graphdata/', function(req, res){
    res.render('graphdata', {
        graphData: graphData,
        title: "Update graph data"
    });
});

app.post('/graphdata/', function(req, res){
    console.log(req.body.graphdatainput);
    graphData = req.body.graphdatainput;
    res.render('graphdata', {
        graphData: graphData,
        title: "Update graph data"
    });
});
server.listen(80);
console.log('Express app started on port %d', 80);

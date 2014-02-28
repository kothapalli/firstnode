var express = require('express');
var app = express();

var quotes = [
  { id : 1, author : 'Audrey Hepburn', text : "Nothing is impossible, the word itself says 'I'm possible'!"},
  { id : 2, author : 'Walt Disney', text : "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you"},
  { id : 3, author : 'Unknown', text : "Even the greatest was once a beginner. Don't be afraid to take that first step."},
  { id : 4, author : 'Neale Donald Walsch', text : "You are afraid to die, and you're afraid to live. What a way to exist."}
];

app.get('/', function(req, res) {
  res.json(quotes);
});

app.get('/quote/random', function(req, res) {
  var id = Math.floor(Math.random() * quotes.length);
  var q = quotes[id];
  res.json(q);
});

app.get('/quote/:id', function(req, res) {
  var result;
  console.log("entered");
  for (var i = 0; i <quotes.length; i++) {
	if(req.params.id == quotes[i].id){
		result = quotes[i];
		break;
	}
  }

  if(result == null) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }

  res.json(result);
});

app.listen(1337);
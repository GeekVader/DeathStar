var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var coordinates = [];
var nextSet = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('Nahojdenie radiusa okrujnosti, po coordinatam centra i proizvolnoi tochke lejawei na nei\n r^2=(x-a)^2+(y-b)^2');
});

app.get('/coor', function(req, res){
	res.json(coordinates);
});

app.get('/coor/:setID', function(req, res){
	var setID = parseInt(req.params.setID, 10);
	var matchedSet = _.findWhere(coordinates, {set: setID});
	var squareRad;
	var rad;

	if(matchedSet){
		squareRad = Math.pow((matchedSet.x-matchedSet.a),2)-Math.pow((matchedSet.y-matchedSet.b),2);
		rad = Math.sqrt(squareRad);
		res.send(JSON.stringify(matchedSet, null, 4)+"\n Radius okrujnosti ="+JSON.stringify(rad, null, 4));
	}else{
		res.status(404).send();
	}
});

app.post('/coor', function(req, res){
	var body = _.pick(req.body, 'x', 'y', 'a', 'b');

	if(!_.isNumber(body.x) || !_.isNumber(body.y) || !_.isNumber(body.a) || !_.isNumber(body.b)){
		return res.status(400).send();
	}

	
	body.set = nextSet++;

	coordinates.push(body);

	res.json(body);
});

app.delete('/coor/:setID', function(req,res){
	var setID = parseInt(req.params.setID, 10);
	var matchedSet = _.findWhere(coordinates, {set: setID});

	if(!matchedSet){
		res.status(404).json({"error": "no set with coordinates found with that id"});
	}else{
		coordinates = _.without(coordinates, matchedSet);
		res.json(matchedSet);
	}
});

app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});

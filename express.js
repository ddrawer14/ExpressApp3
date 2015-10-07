var express = require('express'),
    mongoskin = require('mongoskin'),
    bodyParser = require('body-parser');
    
var app = express();

// Extract params from body of requests
app.use( bodyParser() );

var db = mongoskin.db('mongodb://@' + process.env.IP + ':27017/test', {safe:true});

app.param('collectionName', function(req, res, next, collectionName) {
    
    req.collection = db.collection(collectionName);
    
    return next();
})

// Root route message
app.get('/', function(req, res) {
    
    res.send('Select a collection /collections/messages');
    
})

// GET Request
app.get('/collections/:collectionName', function(req, res, next) {
    req.collection.find( {}, { limit:10, sort: [['_id', -1]] }).toArray( function (e, results) {
        if (e) return next(e);
        res.send(results);
    });
});

// POST Request
app.post('/collections/:collectionName', function(req, res, next) {
    req.collection.insert( req.body, {}, function(e, results){
        if (e) return next(e);
        res.send(results);
    });
});

// GET by ID request
app.get('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.findById( req.params.id, function(e, result){
    if (e) return next(e)
    res.send(result)
  })
})

// PUT request
app.put('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.updateById(req.params.id, {$set:req.body}, {safe:true, multi:false}, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})

// DELETE request 
app.del('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.remove({_id: req.collection.id(req.params.id)}, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})

app.listen(process.env.PORT, function() {
    console.log('port: ' + process.env.PORT);
});
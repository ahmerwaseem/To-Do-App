var express = require('express');
var router = express.Router();

var Todo = require('../../models/todos');

router.route('/')
  .get(function(req,res,next){
    Todo.findAsync({}, null, {sort: {"_id":1}})
    .then(function(todos) {
      res.json(todos);
    })
    .catch(next)
    .error(console.error);
  })
  .post(function(req,res,next){
    var todo = new Todo();
    todo.text = req.body.text;
    todo.saveAsync()
    .then(function(todo){
      console.log("success");
      res.json({'status':'success', 'todo':todo});
    })
    .catch(function(err){
      res.json({'status':'error', 'error':err});
    })
    .error(console.error);
  });
router.route('/:id')
  .get(function(req,res,next){
    Todo.findOneAsync({_id: req.params.id}, {text: 1, done:1})
    .then(function(todo){
      res.json(todo);
    })
    .catch(next)
    .error(console.error);
  })
  .put(function(req,res,next){
    var todo = {};
    var prop;
    for (prop in req.body){
      todo[prop] = req.body[prop];
    }
    Todo.updateAsync({_id: req.params.id}, todo)
    .then(function(updatedTodo){
      return res.json({'status': 'success', 'todo': updatedTodo});
    })
    .catch(function(e){
      return res.status(400).json({'status': 'fail', 'error' : e});
    });
  })
  .delete(function(req,res,next){
    Todo.removeAsync({_id: req.params.id})
    .then(function(data){
      return res.json({'status': 'success', 'deleted' : data});
    })
    .catch(function(e){
      return res.status(400).json({'status': 'fail', 'error' : e});
    });
  })
  module.exports = router;

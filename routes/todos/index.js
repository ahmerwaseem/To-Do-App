var express = require('express');
var router = express.Router();
var Todo = require('../../models/todos');

router.get('/',function(req,res,next){
  Todo.findAsync()
  .then(function(todositems) {
  res.render('todos',{title: 'Todos', todos:todositems});
})
.catch(next)
.error(console.error);
});

module.exports = router;

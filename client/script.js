var $ = require('jquery');
var todoTemplate = require("../views/partials/todo.hbs");


$(function() {
  $(":button").on('click', function(){
    addTodo();
  });

  initTodoObserver();

  $('.filter').on('click', '.show-all', function() {
    $('.hide').removeClass('hide');
  });
  $('.filter').on('click', '.show-not-done', function() {
    $('.hide').removeClass('hide');
    $('.checked').closest('li').addClass('hide');
  });
  $('.filter').on('click', '.show-done', function() {
    $('li').addClass('hide');
    $('.checked').closest('li').removeClass('hide');
  });

  $(".clear").on("click", function() {
    var $doneLi = $(".checked").closest("li");
    for (var i = 0; i < $doneLi.length; i++) {
      var $li = $($doneLi[i]); //you get a li out, and still need to convert into $li
      var id = $li.attr('id');
      deleteTodo(id, function(){
         deleteTodoLi(id);
      });}
  });

  $(":text").on('keypress', function(e){
    var key = e.keyCode;
    if ((key == 13 || key == 169) && $('#add-todo-text').val() !== "" ){
      addTodo();
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  })

  $('ul').on('change', 'li :checkbox', function() {
     var $this = $(this),
         $input = $this[0],
         $li = $this.parent(),
         id = $li.attr('id'),
         checked = $input.checked,
         data = { done: checked };

     updateTodo(id, data, function(d) {
       $this.parent().toggleClass('checked');
     });
   });

    $('ul').on('keydown', 'li span', function(e) {
     var $this = $(this);
     var $span = $this[0];
     var $li = $this.parent();
     var id = $li.attr('id');
     key = e.keyCode;
     target = e.target;
     var text = $span.innerHTML;
     data = { text : text};
     if(key == 27) {
       document.execCommand('undo');
       target.blur();
     }
     else if(key === 13){
       updateTodo(id,data,function(d){
        target.blur();
      });
      e.preventDefault();
     }
   });

   $('ul').on('click', 'li a', function(e){
     var $this = $(this);
     var $li = $this.parent();
     var id = $li.attr('id');
     deleteTodo(id, function(){
        deleteTodoLi(id);
     });

   });


});


   var deleteTodo= function(id, cb){
     $.ajax({
       url: '/todos/api/'+id,
       type: 'DELETE',
       dataType: 'json',
       success: function(){
         cb();
       }
     });
   };

   var deleteTodoLi = function(li) {
     $('#'+li).remove();
   };

   var updateTodo = function(id, data, cb) {
    $.ajax({
      url: '/todos/api/'+id,
      type: 'PUT',
      data: data,
      dataType: 'json',
      success: function(data) {
        cb();
      }
    });
  };


   var addTodo = function(){
     var text = $('#add-todo-text').val();
     $.ajax({
       url: '/todos/api',
       type: 'POST',
       data: {
         text: text
       },
       dataType: 'json',
       success: function(data) {
       var newLiHtml = todoTemplate(data.todo);
       $('form + ul').append(newLiHtml);
       $('#add-todo-text').val('');
      }
     });
   };

   var initTodoObserver = function () {
   var target = $('ul')[0];
   var config = { attributes: true, childList: true, characterData: true };
   var observer = new MutationObserver(function(mutationRecords) {
     $.each(mutationRecords, function(index, mutationRecord) {
       updateTodoCount();
     });
   });
   if(target) {
     observer.observe(target, config);
   }
   updateTodoCount();
 };

 var updateTodoCount = function () {
  $(".count").text($("li").length);
};

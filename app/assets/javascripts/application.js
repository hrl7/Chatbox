// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require_tree .


var token = null,email = null, comments = [];
window.onload = function(){
  fetchToken()
    .then(fetchComments)
    .then(renderComments);

  registerPostEvent();
  setInterval(function(){
    fetchComments()
    .then(renderComments);
  },1000);
}

function registerPostEvent(){
  var input = document.querySelector(".chat-input");
  input.onkeydown = function(e){
    if(e.keyCode == 13){
      console.log(input.value);
      postComment(input.children[0].value);
    }
  }
}

function renderComments(){
  var view = document.querySelector(".chat-view");
  view.innerHTML = ""; 
  for(var i = 0;i < comments.length; i++){
    var com = document.createElement("div"); 
    com.textContent = comments[i].body;
    view.appendChild(com);
  }
};


function fetchToken(){
  return new Promise(function(resolve, reject){
    $.ajax({
      type: "GET",
      success: function(res){
        token = res.token;
        email = res.email;
        resolve();
      },
      url: "/api/v0/user/grant",
    }); 
  });
}

function fetchComments(){
  return new Promise(function(resolve, reject){
    if(token){
      $.ajax({
        url: "/comments.json",
        headers: {
          "X-User-Token" : token,
          "X-User-Email" : email,
        },
        success:function(res){
          comments = res;
          resolve();
        },
        type:"GET"
      });
    }else{
      reject("Need to auth token");
    }
  });
}

function postComment(body){
  return new Promise(function(resolve, reject){
    if(token){
      $.ajax({
        url: "/comments.json",
        headers: {
          "X-User-Token" : token,
          "X-User-Email" : email,
        },
        success:function(res){
          document.querySelector(".chat-input").children[0].value = "";
        },
        type:"POST",
        data: {
          comment: {
            body : body
          }
        },
      });
    }else{
      console.log("Need to auth token");
    }
  });
}

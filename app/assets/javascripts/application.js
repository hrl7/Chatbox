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


console.log("Hello world");
var token = null,email = null;

function fetchToken(){
  $.ajax({
    type: "GET",
    success: function(res){
      token = res.token;
      email = res.email;
    },
    url: "/api/v0/user/grant",
  }); 
}

function comments(){
  if(token){
    $.ajax({
      url: "/comments.json",
      headers: {
        "X-User-Token" : token,
        "X-User-Email" : email,
      },
      success:function(res){
        console.log(res);
      },
      type:"GET"
    });
  }else{
    console.log("Need to auth token");
  }
}

function postComment(body){
  if(token){
    $.ajax({
      url: "/comments.json",
      headers: {
        "X-User-Token" : token,
        "X-User-Email" : email,
      },
      success:function(res){
        console.log(res);
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
}

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


var token = null,email = null, comments = [], polling = null, notifier = null, username = null, input = null, postButton = null;

window.onload = function(){
  username = document.querySelector("#username").textContent.replace(/\s/g,"");
  input = document.querySelector(".chat-input");
  postButton = document.querySelector("#post-button");
  fetchToken()
    .then(fetchComments)
    .then(renderComments)
    .then(requestNotificationPermission)
    .then(registerNotification);

  registerPostEvent();
  startPoll();
}

function startPoll(){
  if(polling)return;
  polling = setInterval(function(){
    fetchLastCommentIndex()
    .then(fetchComments)
    .then(renderComments);
  },1000);
}

function stopPoll(){
  if(polling){
    clearInterval(polling);
    polling = null;
  }
}

function requestNotificationPermission(){
  return new Promise(function(resolve, reject){
    if(("Notification" in window) && Notification.permission !== 'denied') {
      Notification.requestPermission(function(permission){
        if(permission == "granted"){
          resolve();
        }  else {
          reject();
        }
      });
    } else {
      reject();
    }   
  });
}

function registerNotification(){
  notifier = function(message,icon,title){
    new Notification(message,icon,title);
  }
}

function registerPostEvent(){
  input.onkeydown = function(e){
    if(isPostEvent(e)){
      postCommentWithInputValue();
    }
  }
  if(postButton){
    postButton.onclick= postCommentWithInputValue;
  }
}

function postCommentWithInputValue(){
  postComment(input.children[0].value);
}

function isPostEvent(e){
  switch(post_method){
    case "button":
      return false;
    case "meta_enter":
      return e.keyCode == 13 && e.metaKey && !e.shiftKey && !e.ctrlKey && !e.altKey;
    case "enter":
    default:
      return e.keyCode == 13 && !e.metaKey && !e.shiftKey && !e.ctrlKey && !e.altKey;
  }
}

function renderComments(){
  var view = document.querySelector(".chat-view");
  view.innerHTML = ""; 
  for(var i = 0;i < comments.length; i++){
    var comment = document.createElement("div");
    var left = document.createElement("div");
    var name = document.createElement("h5");
    var thum = document.createElement("img");
    var body= document.createElement("div"); 
    var message = document.createElement("div"); 
    var time = document.createElement("div"); 
    comment.classList.add("chat-comment");
    comment.classList.add("panel");
    comment.classList.add("panel-default");
    comment.classList.add("media");
    name.classList.add("chat-username");
    name.classList.add("media-heading");
    thum.classList.add("chat-thumbnail");
    thum.classList.add("media-object");
    left.classList.add("media-left");
    body.classList.add("chat-body");
    body.classList.add("media-body");
    time.classList.add("chat-time");

    time.textContent = comments[i].created_at;
    name.textContent = comments[i].name;
    thum.src = comments[i].avatar.avatar.url;
    message.innerHTML= comments[i].body.replace("\n","<br>","g");

    body.appendChild(name);
    body.appendChild(message);
    comment.appendChild(time);
    left.appendChild(thum);
    comment.appendChild(left);
    comment.appendChild(body);

    view.appendChild(comment);
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

function fetchLastCommentIndex(){
  return new Promise(function(resolve, reject){
    if(token){
      $.ajax({
        url: "/api/v0/comment/latest.json",
        headers: {
          "X-User-Token" : token,
          "X-User-Email" : email,
        },
        success:function(res){
          if(!comments){
            resolve();
          } else if(res.id > comments[comments.length-1].id){
            resolve();
          } else {
            reject();
          }
        },
        type:"GET"
      });
    }else{
      reject("Need to auth token");
    }
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
                  if(notifier && username && res.length != comments.length){
                    var latestComment = res[res.length-1];
                    if( latestComment.name != username){
                      notifier(latestComment.name,{ 
                        body: latestComment.body, 
                        icon: latestComment.avatar.avatar.url
                      });
                    }
                  }
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

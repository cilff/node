// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var usvr = require('./usvr');
var HTML_OK = 200;
var HTML_Partial_Content = 206;
var HTML_Bad_Request = 400;
var HTML_Unauthorized = 401;
var HTML_Forbitten = 403;
var HTML_Not_Found = 404;
var HTML_Requested_Range_Not_Satisfiable = 416;
var HTML_Internal_Server_Error = 500;


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
// default page
app.use(express.static(__dirname + '/public'));

// Winsocket

var numUsers = 0;
var addedUser = false;

io.on('connection', function (socket) {

// when the client emits 'add user', this listens and executes
  socket.on('add user', function (usrinfo) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = usrinfo.username;
    ++numUsers;
    addedUser = true;
    //console.log('add user=%s', JSON.stringify(usrinfo));
    console.log('add user %s, userno=%s, socket id=%s', usrinfo.username, numUsers, socket.id);
    usvr.adduser({"id": socket.id, "username": usrinfo.username, "token": usrinfo.token, "devicename": usrinfo.devicename});
    socket.emit('conn', {
      "numUsers": numUsers, "id": socket.id, "username": usrinfo.username
    });
  });

  socket.on('remove user', function (data) {
    console.log('remove user: reason=%s',data.reason);
    if (addedUser) {
      --numUsers;
      addedUser = false;
      console.log('remove user %s count=%s', socket.username, numUsers);
      usvr.rmuser({"id": socket.id, "username": socket.username})
    }    
    socket.emit('disconn', {
      "numUsers": numUsers, "id": socket.id, "username": socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    //console.log('disconnect=%s',socket.username);
    if (addedUser) {
      --numUsers;
      addedUser = false;
      console.log('disconn user %s count=%s', socket.username, numUsers);
      usvr.rmuser({"id": socket.id, "username": socket.username})
    }
  });

  socket.on('request', function (data, cb) {
    // we tell the client to execute 'new message'
    // parse data, process ane respond to client
    //socket.emit('message', {
    //  username: socket.username,
    //  message: data
    //});
    var cmd, data, token;
    var reply = {"resp":"","err":"","body":{}};
    console.log('request=%s',JSON.stringify(data));
    cmd = data.cmd;
    reply.resp = cmd;
    reply.err = 'none';
    switch(cmd){
      case 'getusers':
        data = usvr.getalluser();
        console.log('getusers=%s', JSON.stringify(data));
        reply.body = data;
        cb(reply);
        break;
      case 'drop':
        var target, arr, i, id;
        console.log('drop=%s', JSON.stringify(data));
        target = data.target;
        if ( target == ''){
          token = usvr.getuser( socket.id, 'token');
          socket.emit('cmd',{"cmd":"drop","type":data.type,"src":data.src,"delay":data.delay,"token":token});    
        }
        else {
          token = usvr.getuser( socket.id, 'token');
          arr = target.split(',');
          for ( i = 0; i < arr.length; i++){
            id = usvr.getsocketid( arr[i], 'devicename' );
            if ( id != '' ){
              console.log('data send to: %s', id);
              if ( id != socket.id )
                socket.to(id).emit('cmd',{"cmd":"drop","type":data.type,"src":data.src,"delay":data.delay,"token":token});
              else
                socket.emit('cmd',{"cmd":"drop","type":data.type,"src":data.src,"delay":data.delay,"token":token});
            }
          }  
        }
        break; 
      default:
        break;
    }
  });  

});



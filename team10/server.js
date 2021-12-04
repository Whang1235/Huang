var http = require("http");
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(request, response) {
  console.log('Connection');
  var path = url.parse(request.url).pathname;

  switch (path) {
    case '/':
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write('Hello, World.');
      response.end();
      break;
    case '/index.html':
      fs.readFile(__dirname + path, function(error, data) {
        if (error){
          response.writeHead(404);
          response.write("opps this doesn't exist - 404");
        } else {
          response.writeHead(200, {"Content-Type": "text/html"});
          response.write(data, "utf8");
        }
        response.end();
      });
      break;
    default:
      response.writeHead(404);
      response.write("opps this doesn't exist - 404");
      response.end();
      break;
  }
});

server.listen(8001);

const io = require('socket.io')(server);

function findNowRoom(client) {
  return Object.keys(client.rooms).find(item => {
    return item !== client.id
  });
}
var messages = [
  { name: "User", message: "Welcome!" }
]
io.on('connection', client => {
  console.log(`socket 用戶連接 ${client.id}`);

  client.on('joinRoom', room => {
    console.log(room);
    
    const nowRoom = findNowRoom(client);
    if (nowRoom) {
      client.leave(nowRoom);
    }
    client.join(room, () => {
      io.sockets.in(room).emit('roomBroadcast', '已有新人加入聊天室！');
    });
  });

  client.on('peerconnectSignaling', message => {
    console.log('接收資料：', message);
 
    const nowRoom = findNowRoom(client);
    client.to(nowRoom).emit('peerconnectSignaling', message)
  });

  client.on('disconnect', () => {
    console.log(`socket 用戶離開 ${client.id}`);
  });
  client.emit("allMessage", messages)
  client.on("sendMessage", function (message) {
      messages.push(message)
      io.emit("newMessage", message)
  })
});
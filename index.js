"use strict";

// socket.ioの読み込み
const socketIO = require("socket.io");
// サーバーでSocket.IOを使える状態にする
const io = socketIO.listen(server);

module.exports.setupWebSocketServer = (port) => {
  const WebSocketServer = require('ws').Server;
  const wsServer = new WebSocketServer({ port: port });
  let offer = null
  const offers = []
  wsServer.on('connection', function(ws) {
    console.log('-- websocket connected --');
    ws.on('message', function(message) {
      const m = JSON.parse(message)
      if (m.type === 'offer') {
        offer = m
        console.log('received offer websocket')
        return
      }
      if (m.type === 'connect') {
        console.log('received connect websocket')
        if (!offer) {
          console.log('offer is not found')
          return
        }
        wsServer.clients.forEach(function each(client) {
          if (isSame(ws, client)) {
            client.send(JSON.stringify(offer))
          }
        });
        return
      }
      wsServer.clients.forEach(function each(client) {
        if (!isSame(ws, client)) {
          client.send(message);
        }
      });
    });
  });
  function isSame(ws1, ws2) {
    // -- compare object --
    return (ws1 === ws2);
  }
  console.log('websocket server start. port=' + port);
}

this.setupWebSocketServer(process.env.PORT || '3000')

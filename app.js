"use strict";

module.exports.setupWebSocketServer = (port) => {
  const WebSocketServer = require('ws').Server;
  const wsServer = new WebSocketServer({ port: port });
  let offerMap = {}
  wsServer.on('connection', function(ws) {
    ws.on('message', function(message) {
      try {
        const m = JSON.parse(message)
        if (m.type === 'offer') {
          offerMap[m.id] = {
            offer: m.offer,
            client: ws
          }
          return
        }
        if (m.type === 'connect') {
          const offer = offerMap[m.id]
          if (offer) {
            ws.send(JSON.stringify({
              type: "offer",
              offer: offer.offer
            }))
            return
          }
          if (!offer) {
            ws.send(JSON.stringify({
              type: "error",
              data: "offer is not found"
            }))
            return
          }
        }
        if (m.type === 'answer') {
          const offer = offerMap[m.id]
          if (offer) {
            offer.client.send(JSON.stringify({
              type: "answer",
              answer: m.answer
            }))
            return
          }
          if (!offer) {
            ws.send(JSON.stringify({
              type: "error",
              data: "offer is not found"
            }))
            return
          }
        }
      } catch (e) {
        try {
          ws.send({
            type: "error",
            data: e.toString()
          })
        } catch (e) {
          console.error(e)
        }
        return
      }
    });
  });
}

// [START appengine_websockets_app]
this.setupWebSocketServer(process.env.PORT || '3000')
// [END appengine_websockets_app]

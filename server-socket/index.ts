'use strict';

import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import os from 'os';

const httpServer = createServer();
const io = new Server(httpServer, {});

const PORT = 80;
httpServer.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`);
});

io.on('connection', (socket: Socket) => {
  console.log('Connection!');
  // convenience function to log server messages on the client
  function log(message: string) {
    socket.emit('log', message);
  }

  socket.on('message', function (...data: [any]) {
    // log('Client said: ' + data);
    // for a real app, would be room-only (not broadcast)
    // from: https://socket.io/docs/v4/emit-cheatsheet/
    // to all clients in the current namespace except the sender
    socket.broadcast.emit('message', data[0]);
  });

  socket.on('create or join', (socketId) => {
    const room = socketId;
    log('Received request to create or join room ' + room);

    var clientsInRoom = io.sockets.adapter.rooms.get(room);
    if (clientsInRoom === undefined) {
      return;
    }
    var numClients = clientsInRoom.size;
    // TODO Where did .sockets come from?
    log('Room ' + room + ' now has ' + numClients + ' client(s)');
    console.log({ clientsInRoom });

    if (numClients === 0) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);
    } else if (numClients === 1) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
    } else {
      // max two clients
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', function () {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev]!.forEach(function (details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });
});

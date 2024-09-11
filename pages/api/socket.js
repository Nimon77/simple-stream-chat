import { Server } from 'socket.io';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {

      socket.on('message', (msg) => {
        io.emit('message', msg); // Envoyer le message à tous les utilisateurs
      });
    });
  }
  res.end();
}

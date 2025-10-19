import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../lib/db';

const ioHandler = async (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/socket_io',
      addTrailingSlash: false,
      cors: { origin: '*' },
    });

    io.on('connection', (socket) => {
      socket.on('message', async ({ token, text }) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const db = await connectToDatabase();
          const message = {
            sender: decoded.username,
            text,
            timestamp: new Date(),
          };
          await db.collection('messages').insertOne(message);
          io.emit('message', message);
        } catch (e) {
          // ignore bad token
        }
      });
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
export const config = { api: { bodyParser: false } };
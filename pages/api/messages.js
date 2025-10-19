import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  const db = await connectToDatabase();
  const messagesCol = db.collection('messages');
  if (req.method === 'GET') {
    const messages = await messagesCol.find().sort({ timestamp: 1 }).toArray();
    return res.status(200).json(messages);
  }
  if (req.method === 'POST') {
    // Authenticate
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ error: 'No token' });
    try {
      const token = authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { text } = req.body;
      const message = {
        sender: decoded.username,
        text,
        timestamp: new Date(),
      };
      await messagesCol.insertOne(message);
      return res.status(201).json(message);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
  res.status(405).end();
}
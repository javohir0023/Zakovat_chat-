import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  const db = await connectToDatabase();
  if (req.method === 'POST') {
    const { username, password, phone, type } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }
    const users = db.collection('users');
    if (type === 'register') {
      const existing = await users.findOne({ username });
      if (existing) return res.status(409).json({ error: 'User exists' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await users.insertOne({ username, password: hashedPassword, phone });
      const token = jwt.sign({ id: user.insertedId, username }, process.env.JWT_SECRET, { expiresIn: '24h' });
      return res.status(201).json({ token, username });
    } else if (type === 'login') {
      const user = await users.findOne({ username });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET, { expiresIn: '24h' });
      return res.status(200).json({ token, username });
    }
    return res.status(400).json({ error: 'Unknown type' });
  }
  res.status(405).end();
}
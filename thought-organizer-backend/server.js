const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 5000;
const mongoURI = 'mongodb://localhost:27017/thoughtOrganizerDB';

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const thoughtSchema = new mongoose.Schema({
  id: String,
  username: String, 
  text: String,
  children: Array,
  linkedNodes: Array,
});

const Thought = mongoose.model('Thought', thoughtSchema);

connection.once('open', () => {
  console.log('Connected to MongoDB.');
});

const JWT_SECRET = 'your_jwt_secret_key'; 


app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;


  const existingUser = await User.findOne({ username });
  if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  
  const newUser = new User({ username, password: hashedPassword });
  try {
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error('Registration error:', error); // Log the error
      res.status(500).json({ message: 'Internal server error' }); // Send a 500 error
  }
});


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received username:', username);
  console.log('Received password:', password);

  try {
    const user = await User.findOne({ username });
    console.log('Found user:', user);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username }, JWT_SECRET); 
      res.json({ success: true, message: 'Login successful!', token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
  } catch (error) {
    console.error('Error during login:', error); 
    res.status(500).json({ error: 'Error during login.' });
  }
});


const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log('Token received:', token); 
  if (!token) {
    console.log('No token provided.'); 
    return res.sendStatus(401); 
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err); 
      return res.sendStatus(403); 
    }
    req.user = user;
    next();
  });
};



app.get('/api/thoughts/state', authenticateToken, async (req, res) => {
  const username = req.user.username; 
  try {
    let rootThought = await Thought.findOne({ id: 'root', username });
    if (!rootThought) {
      rootThought = new Thought({ id: 'root', username, text: 'Root Thought', children: [] });
      await rootThought.save(); 
    }
    res.json(rootThought);
  } catch (error) {
    console.error('Error fetching state:', error);
    res.status(500).json({ error: 'Error fetching state.' });
  }
});


app.post('/api/thoughts/state', authenticateToken, async (req, res) => {
  const username = req.user.username;
  try {
    const rootThought = { ...req.body, username }; 
    await Thought.findOneAndUpdate({ id: rootThought.id, username }, rootThought, { upsert: true, new: true });
    res.json({ message: 'Application state saved successfully.' });
  } catch (error) {
    console.error('Error saving state:', error);
    res.status(500).json({ error: 'Error saving state.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

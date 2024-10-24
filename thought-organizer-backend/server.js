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
  text: String,
  children: Array,
  linkedNodes: Array,
});

const Thought = mongoose.model('Thought', thoughtSchema);

connection.once('open', () => {
  console.log('Connected to MongoDB.');
});

const JWT_SECRET = 'your_jwt_secret_key'; 

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received username:', username);
  console.log('Received password:', password);

  try {
    const user = await User.findOne({ username });
    console.log('Found user:', user);
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ success: true, message: 'Login successful!' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error during login.' });
  }
});



app.get('/api/thoughts/state', async (req, res) => {
  try {
    let rootThought = await Thought.findOne({ id: 'root' });
    if (!rootThought) {
      rootThought = new Thought({ id: 'root', text: 'Root Thought', children: [] });
      await rootThought.save(); 
    }
    res.json(rootThought);
  } catch (error) {
    console.error('Error fetching state:', error);
    res.status(500).json({ error: 'Error fetching state.' });
  }
});

app.post('/api/thoughts/state', async (req, res) => {
  try {
    const rootThought = req.body;
    await Thought.findOneAndUpdate({ id: rootThought.id }, rootThought, { upsert: true, new: true });
    res.json({ message: 'Application state saved successfully.' });
  } catch (error) {
    console.error('Error saving state:', error);
    res.status(500).json({ error: 'Error saving state.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

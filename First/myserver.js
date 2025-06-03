const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const uri = "mongodb+srv://varshith2:Varshith1@cluster0.jeopjnl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Routes
app.post('/api/register', async (req, res) => {
  try {
    console.log('Request body:', req.body);  // Check incoming data

    const newUser = new User(req.body);

    await newUser.save();

    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);

    // Check if it’s a validation error or duplicate key error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error: ' + error.message });
    }
    if (error.code === 11000) {  // Duplicate key error code from Mongo
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

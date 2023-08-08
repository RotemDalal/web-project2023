// //try

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.use(express.json());
// Middleware to parse JSON in request bodies

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://rotemdalal254:rotem254@cluster0.letbq1s.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const User = mongoose.model('User', {
    username: String,
    password: String
});

app.use(express.json());
app.use(session({secret: 'your-secret-key', resave: true, saveUninitialized: true}));

// ...

// Register a new user
app.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({username, password: hashedPassword});
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({error: 'An error occurred.'});
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if (! user) {
            return res.status(401).json({error: 'Invalid username or password.'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (! isPasswordValid) {
            return res.status(401).json({error: 'Invalid username or password.'});
        }

        req.session.user = user;
        res.json(user);
    } catch (error) {
        res.status(500).json({error: 'An error occurred.'});
    }
});

// Protected route
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({error: 'Unauthorized.'});
    }

    res.json({message: 'Welcome to your profile.'});
});

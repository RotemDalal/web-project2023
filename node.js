const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3023;

// Set up your MongoDB connection
mongoose.connect('mongodb+srv://rotemdalal254:rotem254@cluster0.letbq1s.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const User = mongoose.model('User', {
    username: String,
    password: String
});

// Middleware to parse JSON in request bodies
app.use(express.json());

// Set up sessions
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Serve static files (e.g., HTML templates and images)
app.use(express.static(__dirname + '/public'));

// Define a route to display images
app.get('/display/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        res.render('image.html', { filename });
    } catch (error) {
        console.error('Error displaying image:', error);
        res.status(500).json({ error: 'An error occurred while displaying the image.' });
    }
});


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


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

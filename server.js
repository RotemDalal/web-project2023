const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

app.use(express.static('static'));
 const PORT = process.env.PORT || 5500;

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/views/index.html');
//   });

var http = require('http');
app.use(express.static( path.join(__dirname, 'static')));

http.createServer(function(req, res){
    fs.readFile('static/index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
}).listen(PORT);

app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(session({secret: 'your-secret-key', resave: true, saveUninitialized: true}));

// Connect to MongoDB
mongoose.connect('mongodb+srv://elimelech89:c1tGOio1xrumyuks@cluster0.tqsu78x.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userController = require('./controllers/usercontroller');
const productController = require('./controllers/productcontroller');
console.log(userController)
//... your app setup

// Routes
//app.get('/', (req, res) => { ... });

app.post('/register', userController.register);
app.post('/login', userController.login);
// app.get('/profile', userController.profile);

app.get('/products', productController.getProducts);

//... listen to your server

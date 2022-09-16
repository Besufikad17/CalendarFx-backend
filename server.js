const express = require('express');
const app = express();
const cors = require('cors');
const route = require('./routes/routes');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const localURI = require('./config/default.json').localMongoURI;
const hostedURI = require('./config/default.json').hostedMongoURI;
const util = require('./controller/util/util');
const serverless = require('serverless-http');
const PORT = process.env.PORT || 5000;

let isConnected = util.checkInternet;
let URI = isConnected ? hostedURI : localURI;
mongoose.connect(hostedURI, { useNewUrlParser: true, useUnifiedTopology: true  });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.log('Error in the database:', err);
});

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers','Content-Type');
    next();
})

app.get('/', (req,res) => {
  res.send('<h1>Welcome to CalenderFx <a href="https://besufikad17.github.io/CalenderFx-docs/">Docs</a><h2>')
})

app.use(helmet());
app.use(cors());
app.use(express.json())
app.use('/api', route)
app.listen(PORT)


const express = require('express');
const app = express();
const cors = require('cors');
const route = require('./routes/routes');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');


mongoose.connect("mongodb://localhost:27017/calenderfx", { useNewUrlParser: true, useUnifiedTopology: true  });
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


app.use(helmet());
app.use(cors());
app.use(express.json())
app.use('/api', route)
app.listen(5000);
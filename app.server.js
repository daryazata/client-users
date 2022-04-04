const express = require('express');
const request = require('request-promise');
const cron = require('node-cron');
const cache = require('memory-cache');
const cors = require('cors');

const options = {
  method: 'GET',
  uri: 'https://randomuser.me/api?results=50&inc=gender,name,location,email',
};

const requestApi = () => {
  request(options)
    .then(function (body) {
      writeInCache(body);
    })
    .catch(function (error) {
      console.error(error);
    });
};

const runCronJob = () => {
  //This will run every 30 seconds
  cron.schedule('*/30 * * * * *', () => {
    requestApi();
  });
};

requestApi();
runCronJob();

const writeInCache = (data) => {
  // if one request was caches successfully, it will serve as a fallback to any next request
  cache.put('data', data);
};

const app = express();

// middlewares

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname, './build'));

// middleware collects cached data into request
app.use((req, res, next) => {
  if (cache.get('data')) req.cachedData = JSON.parse(cache.get('data'));
  next();
});

// routes

const userRouter = require('./routes/userRoutes');

app.use('/api/users', userRouter);

// optional routing if req. doesnt match any route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../random_users-client/build/index.html'));
});

module.exports = app;

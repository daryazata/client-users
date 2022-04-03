const app = require('./app.server');

const port = 8080;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

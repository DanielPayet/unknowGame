import * as express from 'express';
import { AppController } from './controllers/index';

const app: express.Application = express();
const port: number = +process.env.PORT || 3000;

app.use(AppController);

const fs = require('fs');

fs.open('./public/index.html', 'r', (err, fd) => {
  if (err) throw err;
  fs.close(fd, (err) => {
    if (err) throw err;
  });
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
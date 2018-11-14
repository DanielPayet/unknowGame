import { AppController } from './controllers/index';
import * as express from 'express';
import * as path from 'path';

const port: number = +process.env.PORT || 3000;
const app: express.Application = express();
app.use(AppController);
app.use(express.static(path.join(process.cwd(), "/dist/public/")));

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
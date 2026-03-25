import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { env } from './env';
import route from './common/Route';
import { DbConnection } from './common/DBConfig';

const port = env.serverPort || 9001;
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

DbConnection.initialize().then(async () => {
    console.log('Database connected successfully');
}).catch((err: any) => {
    console.log('Error: ', err);
});
app.use("/api", route);

app.listen(port, () => {
    console.log('Server running in', port, 'port.');
});
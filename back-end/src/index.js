import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(routes);

export default app;
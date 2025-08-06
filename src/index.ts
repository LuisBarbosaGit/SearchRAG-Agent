import express from 'express'
import { routes } from './routes/index';

require('dotenv').config();
const PORT = 3000;
const app = express();
routes(app)

app.listen(PORT, () => {
    console.log('Server is runnig')
})


import express from 'express'
import { MainRoutes } from './main.routes'


export const routes = (app: express.Express) => {
    const cors = require('cors');
    app.use(express.json())
    app.use(cors());
    app.use(MainRoutes)
}
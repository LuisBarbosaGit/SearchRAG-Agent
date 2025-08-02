import express from 'express'
import { MainRoutes } from './main.routes'

export const routes = (app: express.Express) => {
    app.use(express.json())
    app.use(MainRoutes)
}
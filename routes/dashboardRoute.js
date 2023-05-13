import {Router} from "express";
import path from 'path';

export const dashboardRoute = new Router();
const __dirname = path.resolve();

dashboardRoute.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});
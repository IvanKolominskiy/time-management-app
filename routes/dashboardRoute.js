import {Router} from "express";
import path from 'path';
import {loginRoute} from "./loginRoute.js";

export const dashboardRoute = new Router();
const __dirname = path.resolve();

loginRoute.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});
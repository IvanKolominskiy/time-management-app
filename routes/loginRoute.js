import {Router} from "express";
import path from 'path';

export const loginRoute = new Router();
const __dirname = path.resolve();

loginRoute.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
})

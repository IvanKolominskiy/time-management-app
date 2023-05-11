import {Router} from "express";
import path from 'path';

export const homeRoute = new Router();
const __dirname = path.resolve();

homeRoute.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'main.html'));
})
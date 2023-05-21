import {Router} from "express";
import jwt from "jsonwebtoken";
import {PRIVATE_ACCESS_KEY, PRIVATE_REFRESH_KEY} from "../secrets.js";

export const refreshTokenRoute = new Router();

refreshTokenRoute.post('/refreshToken', async (req, res) => {
    console.log(req.body);

    const currentDate = new Date().toISOString();

    const clientRefreshToken = req.body.refreshToken;
    const serverRefreshToken = req.cookies.refreshToken;

    if (clientRefreshToken === serverRefreshToken && Date.parse(currentDate) <= Date.parse(req.cookies.refreshTokenEndTime)) {

        const decoded = jwt.verify(clientRefreshToken, PRIVATE_REFRESH_KEY);

        const accessToken = jwt.sign({
                _id: decoded._id,
            },
            PRIVATE_ACCESS_KEY,
            {
                expiresIn: '15m'
            });

        const refreshToken = jwt.sign({
                _id: decoded._id,
            },
            PRIVATE_REFRESH_KEY,
            {
                expiresIn: '30d'
            });

        const refreshTokenEndTime = new Date();
        refreshTokenEndTime.setHours(refreshTokenEndTime.getHours() + 720);

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true});
        res.cookie('refreshTokenEndTime', refreshTokenEndTime, {httpOnly: true});

        const expiresIn = new Date();
        expiresIn.setMinutes(expiresIn.getMinutes() + 15);

        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiresIn: expiresIn
        });
    } else {
        res.status(404).json({
            message: 'Токен обновления невалидный или устарел'
        });
    }
});
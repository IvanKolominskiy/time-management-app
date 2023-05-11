import express from 'express';
import mongoose from 'mongoose';
import {registerRoute} from "./routes/registerRoute.js";
import {homeRoute} from "./routes/homeRoute.js";
import {loginRoute} from "./routes/loginRoute.js";
import path from 'path';

const app = express();

app.use(express.json());

app.use(registerRoute);
app.use(homeRoute);
app.use(loginRoute);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname,'public')));

function startServer() {
    app.listen(3000, (error) => {
        if (error) {
            return console.log(error);
        }

        console.log("Server is running");
    })

    mongoose.connect('mongodb+srv://admin:F5jkkbaHvORSjvhF@cluster0.7pfnlup.mongodb.net/blog?retryWrites=true&w=majority')
        .then(() => console.log("Data base is connected"))
        .catch((error) => console.log(error));
}

startServer();
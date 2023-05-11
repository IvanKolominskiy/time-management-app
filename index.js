import express from 'express';
import mongoose from 'mongoose';
import {authRouter} from "./authentication/authRouter.js";
import path from 'path';

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

const __dirname = path.dirname(require.main.filename);
app.use(express.static(path.join(__dirname,'public')));

app.get('/time-management-app/public/main.html', (req,res) => {
    res.sendFile("C:/Users/molou/WebstormProjects/time-management-app/public/main.html")
});
app.get('/time-management-app/public/register.html', (req,res) => {
    res.sendFile("C:/Users/molou/WebstormProjects/time-management-app/public/register.html")
});
app.get('/time-management-app/public/login.html', (req,res) => {
    res.sendFile("C:/Users/molou/WebstormProjects/time-management-app/public/login.html")
});
app.get('/time-management-app/public/dashboard.html', (req,res) => {
    res.sendFile("C:/Users/molou/WebstormProjects/time-management-app/public/dashboard.html")
});
app.get('/time-management-app/style.css', (req,res) => {
    res.sendFile("C:/Users/molou/WebstormProjects/time-management-app/style.css")
});

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
import express from 'express';
import mongoose from 'mongoose';
import {authRouter} from "./authentication/authRouter.js";

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

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
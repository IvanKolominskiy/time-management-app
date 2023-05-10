import express from 'express';
import mongoose from 'mongoose';

const app = express();

function startServer() {
    app.listen(3000, (error) => {
        if (error) {
            return console.log(error);
        }

        console.log("Server is running");
    })

    mongoose.connect('mongodb+srv://admin:F5jkkbaHvORSjvhF@cluster0.7pfnlup.mongodb.net/?retryWrites=true&w=majority')
        .then(() => console.log("Data base is connected"))
        .catch((error) => console.log(error));
}

startServer();
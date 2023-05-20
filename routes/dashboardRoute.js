import {Router} from "express";
import {validationResult} from "express-validator";
import {taskValidation} from "../validations/taskValidation.js";
import TaskModel from "../models/Task.js";
import path from 'path';
import jwt from "jsonwebtoken";
import {PRIVATE_KEY} from "../secrets.js";

export const dashboardRoute = new Router();
const __dirname = path.resolve();

dashboardRoute.get('/dashboard', async (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

dashboardRoute.post('/dashboard', taskValidation, async (req, res) => {
    console.log(req.body);

    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    const decoded = jwt.verify(token, PRIVATE_KEY);

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const doc = new TaskModel({
            name: req.body.name,
            description: req.body.description,
            deadlineDay: req.body.deadlineDay,
            deadlineMonth: req.body.deadlineMonth,
            deadlineYear: req.body.deadlineYear,
            status: req.body.status,
            user: decoded._id
        });

        const task = await doc.save();
        res.json({task: task});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать задачу',
        });
    }
});

dashboardRoute.get('/dashboard/getTasks', async (req, res) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    const decoded = jwt.verify(token, PRIVATE_KEY);

    try {
        const tasks = await TaskModel.find( {user: decoded._id} );
        res.json({tasks: tasks});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить задачи',
        });
    }
});

dashboardRoute.delete('/dashboard/deleteTask', async (req, res) => {
    console.log(req.body);

    try {
        const taskId = req.body.id;

        await TaskModel.findOneAndDelete({_id: taskId})
            .then((doc) => {
                if (!doc) {
                    return res.status(404).json({
                        message: 'Задача не найдена'
                    });
                }

                res.json({
                    success: true,
                });
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json({
                    message: 'Не удалось удалить задачу',
                });
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить задачу',
        });
    }
});

dashboardRoute.patch('/dashboard/editTask', taskValidation, async (req, res) => {
    console.log(req.body);

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const newTask = await TaskModel.findOneAndUpdate(
            {
                _id: req.body.id
            },
            {
                name: req.body.name,
                description: req.body.description,
                deadlineDay: req.body.deadlineDay,
                deadlineMonth: req.body.deadlineMonth,
                deadlineYear: req.body.deadlineYear,
                status: req.body.status
            }, {
                returnOriginal: false
            });

        res.json({task: newTask});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось изменить задачу"
        });
    }
});
import mongoose from "mongoose";

const TaskBasketSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('TaskBasket', TaskBasketSchema);
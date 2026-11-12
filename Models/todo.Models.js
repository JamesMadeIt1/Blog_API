const { required } = require('joi');
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task:{
        type: String,
        required: true
    },
    
    Completed:{
        type:Boolean,
        required: true
    }

},{timestamps: true});

const TodoModel = mongoose.model("Todo", todoSchema);

module.exports = TodoModel;
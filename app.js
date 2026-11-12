const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./Middlewares/logger');
const glocalErrorhandler = require('./Middlewares/global_error_handler');
const validator = require('./Middlewares/validator');
const validatePatchTodo = require('./Middlewares/validator_for_PATCH_request');
const cors = require('cors');
const Todo = require('./Models/todo.Models');
const ConnectDB = require('./Database/db');
const PORT = process.env.PORT || 3002;
ConnectDB();

// Parse incoming JSON request
app.use(express.json());

// Middleware
const corsOptions = {
  origin: 'http://localhost:3002'
};

app.use(cors(corsOptions));
app.use(logger);



//GET all todos
app.get('/todos' ,async(req ,res ,next)=>{

  const todos = await Todo.find({}); //returns all todos in MongoDB database
  try{
     res.status(200).json(todos)
  }catch(error){
    next(error)
  }
})


//GET specific todos
app.get('/todos/:id' ,async(req ,res ,next)=>{
  try{
    const id = req.params.id;
    if(!mongoose.isObjectIdOrHexString(id)){
      return res.status(400).json({error: "Invalid ID"});
     }
    const todo = await Todo.findById(id);  //returns the todo the specific id in MongoDB database

    if(!todo){
      return res.status(404).json({error: "Todo not found"});
    }
    res.status(200).json(todo);
    
  }catch(error){
    next(error)
  }}
);


//POST a todo
app.post('/todos',validator,async (req ,res ,next)=>{
  
  try{
      const {task ,Completed} = req.body;
      const newTodo = new Todo({ task,Completed}) //validates The data and creates a new instance of the Todo model
      await newTodo.save(); //insert the new todo into MongoDB database
      res.status(201).json({message: "Todo created successfully", todo: newTodo});

  }catch(error){
    next(error)
  }});
 

//UPDATE a todo by id
app.patch('/todos/:id', validatePatchTodo, async(req, res, next) => {

  const id = (req.params.id, 10);
  const newtodo = await new Todo.findByIdAndUpdate(id);  //Updates the todo in MongoDB database


  if (!newtodo) {
    return res.status(404).json({ error: 'Todo not found' }); 
  }
  return res.status(200).json({ message: 'Todo updated successfully', newtodo });
});


//DELETE a todo by id
app.delete('/todos/:id' ,async(req ,res ,next)=>{
const id = (req.params.id);
const newtodo = await Todo.findByIdAndDelete(id);  //deletes the todo from MongoDB database
if(!newtodo){
  return res.status(404).json({message: "Todo not found"}); 
}
res.status(200).json({message: `[${newtodo.task}] has been deleted successfully`});
}
)

// Global error handling middleware
app.use(glocalErrorhandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
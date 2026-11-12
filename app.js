const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./Middlewares/logger');
const glocalErrorhandler = require('./Middlewares/global_error_handler');
const validator = require('./Middlewares/validator');
const validatePatchTodo = require('./Middlewares/validator_for_PATCH_request');
const errorHandler = require('./Middlewares/global_error_handler');
const cors = require('cors');
const articleRoutes = require('./Routes/article.route');
const ConnectDB = require('./Database/db');
const PORT = process.env.PORT || 3002;
ConnectDB();


// Parse incoming JSON request
app.use(express.json());



// Middleware
const corsOptions = {
  origin: 'http://localhost:3002'
};



// Enable CORS for all routes
app.use(cors(corsOptions));



// Logs all incoming requests
app.use(logger);

app.use('/api', articleRoutes);

// Global error handling middleware
app.use(glocalErrorhandler);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
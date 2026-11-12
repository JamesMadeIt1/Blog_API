const Joi = require('joi');
const ArticleModel = require('../Models/BlogAPI.Models');


//Post Article
const postArticle = async (req, res, next) => {
    const articleSchema = Joi.object({
        title: Joi.string().min(5).required(),
        content: Joi.string().min(20).required(),
        author: Joi.optional().string().default('Guest')
    });

const {error ,value} = articleSchema.validate(req.body);
if(error){
    return res.status(400).json("Please provide valid title and content. Title must be at least 5 characters long, content must be at least 20 characters long, and author is optional.");
}
    try {
        const newArticle = new ArticleModel({value});
        await newArticle.save();
        return res.status(201).json({
            message:"Article created successfully",
            data : "newArticle"
        })
    }catch (error){
             console.error('Error retrieving articles:', error);
        next(error)
    }
}

//Get Article All Articles
const getAllArticles = async (req, res, next) => {
    const{limit =10 ,page} = req.query;
        const skip = (page-1)*limit;
    try {
        const articles = await ArticleModel.find({})
        .skip(skip)
        .limit(limit)
        .Sort({createdAt: -1});

        res.json(articles);
        res.status(200).json({
            message: "Articles successfully retrieved",
            data: articles
        })
    }catch (error){
        console.error('Error retrieving articles:', error);
        next(error)
    }
}


//Get Article by Id
const getArticleById = async (err,req, res, next) => {

      if(err.name === 'CastError' && err.kind === 'ObjectId'){
        return res.status(400).json({error: "Invalid article ID"});
    }

    try {
        const iD = req.params.id;
        const article = await ArticleModel.findById(iD);
        if(!article){
            return res.status(404).json({error: "Article not found"});
        }
        res.status(200).json({
            message: "Article retrieved successfully",
            data: article
        });
    }catch (error){
        console.error('Error retrieving article:', error);
        next(error);
    }
}

//Update Article By Id
const updateArticleById = async (err,req, res, next) => {

      if(err.name === 'CastError' && err.kind === 'ObjectId'){
        return res.status(400).json({error: "Invalid article ID"});
    }

    const articleschema =joi.object({
        title: Joi.string().optional().min(5),
        content: Joi.string().optional().min(20),
    })
    

const {error ,value} = articleschema.validate({value}); 
    try {
        //assigning req.params.id to a variable iD
        const iD = req.params.id;

        //updating the article in the database using findByIdAndUpdate method of ArticleModel
        const updateArticle = await ArticleModel.findByIdAndUpdate(iD, {...req.body}, { new: true  ,runValidators: true});

        //if there is no article found with the given id, return a 404 error
        if(!updateArticle){
            return res.status(404).json({error: "Article not found"});
        }
        //returning a success message along with the updated article
        res.status(200).json({
            message: "Article updated successfully",
            // returning the updated article in the response
            data: updateArticle
        });
        //logging the updated article to the console for debugging purposes
    }catch (error){
        console.error('Error updating article:', error);
        next(error);
    }
}

//Get Delete By Id
const deleteArticleById = async (err,req, res, next) => {
    if(err.name === 'CastError' && err.kind === 'ObjectId'){
        return res.status(400).json({error: "Invalid article ID"});
    }
    try{
        const iD = req.params.id;
        const deleteArticle = await ArticleModel.findByIdAndDelete(iD);

        if(!deleteArticle){
            return res.status(404).json({error: "Article not found"});
        }   

        res.status(200).json({
            message: "Article deleted successfully",
            data: deleteArticle
        });
    }catch (error){
        console.error('Error deleting article:', error);
        next(error);
    }
}

module.exports = {
    postArticle,
    getAllArticles,
    getArticleById,
    updateArticleById,
    deleteArticleById
}   
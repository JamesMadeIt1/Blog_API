const express =require('express');
const router = express.Router();
const {
    postArticle
    ,getAllArticles
    ,getArticleById
    ,updateArticleById
    ,deleteArticleById
} = require('../Controllers/article.Controller');


//Post Article
router.post('/articles',postArticle);

//Get Article All Articles
router.get('/articles',getAllArticles);

//Get Article by Id
router.get('/articles/:id',getArticleById);

//Update Article by Id
router.put('/articles/:id',updateArticleById);

//Delete Article by Id
router.delete('/articles/:id',deleteArticleById);


module.exports = router;
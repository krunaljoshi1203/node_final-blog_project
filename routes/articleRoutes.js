const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticate, requireAuth, requireRole } = require('../middleware/auth');

router.get('/', authenticate, articleController.getAllArticles);
router.get('/articles/:id', authenticate, articleController.getArticle);

router.get('/my-articles', authenticate, requireAuth, articleController.getMyArticles);
router.get('/articles/new', authenticate, requireAuth, articleController.getArticleForm);
router.post('/articles', authenticate, requireAuth, articleController.createArticle);
router.get('/articles/:id/edit', authenticate, requireAuth, articleController.getEditArticleForm);
router.put('/articles/:id', authenticate, requireAuth, articleController.updateArticle);
router.delete('/articles/:id', authenticate, requireAuth, articleController.deleteArticle);
router.post('/articles/:id/comments', authenticate, requireAuth, articleController.addComment);

module.exports = router;

const Article = require('../models/Article');
const Comment = require('../models/Comment');
const User = require('../models/User');

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('author', 'username role')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' }
      })
      .sort({ createdAt: -1 });

    res.render('articleList', {
      title: 'All Articles',
      articles,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching articles');
  }
};

exports.getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user._id })
      .populate('author', 'username role')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' }
      })
      .sort({ createdAt: -1 });

    res.render('myArticles', {
      title: 'My Articles',
      articles,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching your articles');
  }
};

exports.getArticleForm = (req, res) => {
  res.render('articleForm', {
    title: 'New Article',
    article: null,
    user: req.user,
    error: null
  });
};

exports.getEditArticleForm = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send('Article not found');
    }

    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).send('Access denied');
    }

    res.render('articleForm', {
      title: 'Edit Article',
      article,
      user: req.user,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading article');
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.render('articleForm', {
        title: 'New Article',
        article: null,
        user: req.user,
        error: 'Title and content are required'
      });
    }

    const article = new Article({
      title,
      content,
      author: req.user._id
    });

    await article.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { articles: article._id }
    });

    res.redirect('/my-articles');
  } catch (err) {
    console.error(err);
    res.render('articleForm', {
      title: 'New Article',
      article: null,
      user: req.user,
      error: 'Failed to create article'
    });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send('Article not found');
    }

    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).send('Access denied');
    }

    const { title, content } = req.body;
    article.title = title || article.title;
    article.content = content || article.content;
    await article.save();

    res.redirect('/my-articles');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating article');
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send('Article not found');
    }

    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).send('Access denied');
    }

    await Comment.deleteMany({ article: article._id });

    await User.findByIdAndUpdate(article.author, {
      $pull: { articles: article._id }
    });

    await article.deleteOne();
    res.redirect('/my-articles');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting article');
  }
};

exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'username role')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' }
      });

    if (!article) {
      return res.status(404).send('Article not found');
    }

    res.render('articleItem', {
      title: article.title,
      article,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching article');
  }
};

exports.addComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/login');
    }

    const { content } = req.body;
    if (!content) {
      return res.redirect(`/articles/${req.params.id}`);
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send('Article not found');
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      article: article._id
    });

    await comment.save();

    article.comments.push(comment._id);
    await article.save();

    res.redirect(`/articles/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding comment');
  }
};

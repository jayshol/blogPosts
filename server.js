const express = require('express');
const uuid = require('uuid');
const app = express();
const morgan = require('morgan');

const blogPostRouter = require('./blogPostsRouters');

app.use(morgan('common'));

app.use('/blog-posts', blogPostRouter);


app.listen(process.env.PORT || 8080, () => {
	console.log(`Your server is listening at port ${process.env.PORT || 8080}`);
});
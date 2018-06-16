const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('Keto Diet', 'The high fat low carb diet', 'jayshol');
BlogPosts.create('Miracle oil', 'CBD oil is the new miracle oil', 'jayshol');

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title','content','author'];
	for(let i=0;i<requiredFields.length;i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			res.status(400).send(message);
		}
	}

	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
	res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post id : \`${req.params.id}\``)
	res.status(204).end();
});

router.put('/:id', jsonParser, (req,res) => {
	const requiredFields = ['title','content', 'author'];
	for(let i=0;i<requiredFields.length;i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			res.status(400).send(message);
		}
	}

	if(req.params.id !== req.body.id){
		const message = `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
		console.error(message);
		res.status(400).send(message);
	}
	//updating blog post
	const updatedItem = BlogPosts.update({
		id: req.body.id,
		title: req.body.title,
		content: req.body.content,
		author:req.body.author
	});

	res.status(200).json(updatedItem);

});

module.exports = router;
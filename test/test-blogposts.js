const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

describe('blog-posts', function(){

	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();
	});

	it('should list blogs on GET', function(){
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.a('array');
			expect(res.body.length).to.be.at.least(1);
			const expectedKeys = ['title', 'content', 'author', 'publishDate'];
			res.body.forEach(function(item){
				expect(item).to.be.a('object');
				expect(item).to.include.keys(expectedKeys);
			});
		});
	});

	it('should add a blog on POST', function(){
		const newBlog = {'title': 'zomacton', 'content': 'Human growth hormone', 'author':'jayshol'};
		return chai.request(app)
		.post('/blog-posts')
		.send(newBlog)
		.then(function(res){
			expect(res).to.have.status(201);
			expect(res).to.be.json;
			expect(res.body).to.be.a('object');
			expect(res.body).to.include.keys('title','content','author','publishDate');
			expect(res.body.id).to.not.equal(null);
			expect(res.body).to.deep.equal(Object.assign(newBlog, {id:res.body.id, publishDate: res.body.publishDate}));
		});
	});

	it('should update a blog on PUT', function(){
		const updateBlog = {
			'title': 'tev tropin',
			'content': 'human growth hormone',
			'author': 'jayshol'
		};

		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			updateBlog.id = res.body[0].id;
			updateBlog.publishDate = res.body[0].publishDate;

			return chai.request(app)
			.put(`/blog-posts/${updateBlog.id}`)
			.send(updateBlog);
		})
		.then(function(res){
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.a('object');
			expect(res.body).to.deep.equal(updateBlog);
		});
	});

	it('should delete items on DELETE', function(){
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			return chai.request(app)
			.delete(`/blog-posts/${res.body[0].id}`)
		})
		.then(function(res){
			expect(res).to.have.status(204);
		});
	});
});
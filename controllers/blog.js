var config = require('../config');
var post = require('../models/post');
var category = require('../models/category');

/* blog list controller */
module.exports = function(req, res, next) {

	// post.createOne({
	// 	title: '这个一篇文章啊真的',
	// 	contents: '挺不错的，继续努力啊。加油',
	// 	url: 'an-article'
	// },function(err, docs) {
	// 	console.log(docs);
	// })

	// post.createOne({
	// 	title: '分类测试',
	// 	contents: "就是测试一下效果而已啦222",
	// 	url: 'test-categories',
	// 	category: '550f7abf36daf2afd83ad4f4',
	// 	keywords: '测试'
	// }).then(function(post) {
	// 	console.log(post)
	// });

	// category.createOne({
	// 	name: '前端开发',
	// 	url:  'front-end-dev'
	// }).then(function(c) {
	// 	console.log(c);
	// })


	post.findAll()
		// Find it belongs to which category
		.then(searchCategoryName)
		// Render pages
		.then(function(posts) {
			res.render('blog', {
				config: config,
				posts: posts
			})
		});



}

function searchCategoryName(posts) {
	var deferred = Promise.defer();
	Promise.all(posts.map(function(post) {
		var defer = Promise.defer();
		category_id = post.category;
		category.findById(category_id)
			.then(function(c) {
				if (c == null) defer.resolve(post);
				post.category_name = c.name;
				defer.resolve(post);
			}.bind(this));
		return defer.promise;
	})).then(function(posts) {
		deferred.resolve(posts);
	});
	return deferred.promise;
}
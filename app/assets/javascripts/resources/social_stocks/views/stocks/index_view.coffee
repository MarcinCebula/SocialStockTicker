SocialStocks.IndexView = Ember.View.extend
	templateName: 'resources/social_stocks/templates/stocks/index_template'
	tagName: 'tr'
	contentBinding: 'SocialStocks.stocksController.content'
	controllerBinding: 'SocialStocks.stocksController'

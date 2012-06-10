SocialStocks.IndexView = Ember.View.extend
	templateName: 'app/templates/stocks/index_template'
	tagName: 'tr'
	contentBinding: 'SocialStocks.stocksController.content'
	controllerBinding: 'SocialStocks.stocksController'

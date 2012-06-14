SocialStocks.ShowView = Ember.View.extend
	templateName: 'resources/social_stocks/templates/stocks/show_template'
	destroyRecord: () ->
		stock = this.get('stock')
		SocialStocks.stocksController.destroyRecord(stock)
SocialStocks.ShowView = Ember.View.extend
	templateName: 'app/templates/stocks/show_template'
	destroyRecord: () ->
		stock = this.get('stock')
		SocialStocks.stocksController.destroyRecord(stock)
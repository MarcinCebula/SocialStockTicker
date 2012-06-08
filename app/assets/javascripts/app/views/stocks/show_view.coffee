SocialStocks.ShowView = Ember.View.extend
	templateName: 'app/templates/stocks/show_template'
	destroyRecord: () ->
		stock = this.get('content')
		SocialStocks.stocksController.destroyRecord(stock)
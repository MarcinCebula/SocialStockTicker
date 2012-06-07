SocialStocks.AddStockView = Ember.View.extend
	social_stock: null,
	insertNewline: ->
		console.log("submitStock")
	submitStock: -> 
		stock = this.get('social_stock')
		unless stock == undefined or stock == '' or stock == null
			SocialStocks.stocksController.loadStock(stock)
		



SocialStocks.StocksField = Ember.TextField.extend 
	valueBinding: 'SocialStocks.stocksController.stockName'
	# target: "SocialStocks.stocksController" 
	# action: "loadRecord"
	# action: "alertOfStockName"
	placeholder: "Social Stock"
	class: "span4 input-medium"
	insertNewline: (evt) ->
		SocialStocks.stocksController.loadStock()
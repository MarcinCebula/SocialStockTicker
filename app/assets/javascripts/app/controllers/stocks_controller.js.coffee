SocialStocks.stocksController = Em.ArrayController.create
	content: [],
	facebook_api_url: "https://graph.facebook.com/"
	loadStock: (stock_id) ->
			stocks_controller = this
			url = this.facebook_api_url + stock_id
			$.ajax url,
				type: 'Get'
				dataType: 'json'
				success: (data) ->
					stock = SocialStocks.Stock.create
						page_id: data.id
						name: data.name 
						link: data.link
						ptat_score: data.talking_about_count
					console.log(stock)
					stocks_controller.pushObject(stock) 
				error: (data) ->
					alert "Incorrect facebook id or name"

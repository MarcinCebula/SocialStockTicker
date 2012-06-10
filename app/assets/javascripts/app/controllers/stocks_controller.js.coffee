SocialStocks.stocksController = Em.ArrayController.create
	content: [],
	stockName: null
	stockPageId :null
	facebook_api_url: "https://graph.facebook.com/"
	resource_index: "/api/v1/stocks/"
	resource_delete: "/api/v1/stocks/"
	create_resource: "/api/v1/stocks/"
	init: () ->
		@_super()
		sc = this
		url = sc.resource_index
		$.ajax url,
			type: 'GET'
			dataType: 'json'
			success: (data) ->
				data.stock.map (s) ->
					stock = SocialStocks.Stock.create
						page_id: s.stock.page_id
						name: s.stock.name
						link: s.stock.link
						ptat_score: s.stock.ptat_score
					sc.pushObject(stock) 
	
	loadStock: () ->
		sc = this
		stockName = sc.get('stockName')
		sc.createStock(stockName, sc.facebook_api_url) unless sc.validate(stockName)  
	
	validate: (stockName) ->	
		stockName == undefined or stockName == '' or stockName == null
	
	createStock: (stock_name, facebook_url) ->
		sc = this
		url = facebook_url + stock_name 
		$.ajax url,
			type: 'GET'
			dataType: 'json'
			success: (data) ->
				stock = SocialStocks.Stock.create
					page_id: data.id
					name: data.name 
					link: data.link
					ptat_score: data.talking_about_count
				console.log(stock)
				sc.saveRecord(stock)
			error: (data) ->
				alert "Incorrect facebook id or name"
		
	saveRecord:(stock) ->
		console.log("saveRecord")
		sc = this
		url = sc.create_resource
		$.ajax url,
			type: 'POST'
			dataType: 'json'
			data: { 
				page_id: stock.page_id,
				name: stock.name
				ptat_score: stock.ptat_score
				link: stock.link
			},
			success: (data) ->
				sc.pushObject(stock) 
			error: (status, data) ->
				alert "Stock could not be saved to the server"
				
	destroyRecord: (stock) ->
			sc = this
			url = this.resource_delete + stock.page_id
			$.ajax url,
				type: 'DELETE'
				dataType: 'json'
				success: (data) ->
					sc.popObject(stock) 
				error: (data) ->
					alert "The object could not be delete from server"
	
	convertObjectToStockObject: (object) ->
		stock = SocialStocks.Stock.create
			page_id: object.page_id
			name: object.name 
			link: object.link
			ptat_score: object.ptat_score			

SocialStocks.stocksController = Em.ArrayController.create
	content: [],
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
							page_id: s.id
							name: s.name 
							link: s.link
							ptat_score: s.ptat_score
						sc.pushObject(stock) 


	loadStock: (page_name_id) ->
			sc = this
			url = this.facebook_api_url + page_name_id
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
					#sc.pushObject(stock) 
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
			error: (data) ->
				alert("Server error:" + data)
	destroyRecord: (stock) ->
			sc = this
			url = this.resource_delete + stock.page_id
			$.ajax url,
				type: 'DELETE'
				dataType: 'json'
				success: (data) ->
					console.log(stock)
					sc.popObject(stock) 
				error: (data) ->
					alert "The object could not be delete from server"

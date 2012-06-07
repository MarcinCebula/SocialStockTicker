SocialStocks.stocksController = Em.ArrayController.create
	content: [],
	facebook_api_url: "https://graph.facebook.com/"
	resource_delete: "/stocks/"
	create_resource: "/stocks/"
	init: () ->
			@_super()
			sc = this
			url = this.facebook_api_url + 'bmw'
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
		url = sc.createResource
		$.ajax url,
			type: 'POST'
			dataType: 'json'
			#data: { stock.serialize }
			success: (data) ->
				sc.pushObject(stock) 
			error: (data) ->
				alert "Could not save data to server"

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

window.SocialStocks = Ember.Application.create()

SocialStocks.ClickableView = Ember.View.extend
	templateName: 'app/templates/stocks/click_this'
	init: ->
		@_super()
		console.log("Init crap")
	click: (evt) ->
		console.log('some crap')

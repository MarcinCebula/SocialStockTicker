SocialStocks.StocksInput = Ember.Object.extend
	social_stock: 'cat'
	init: () ->
		@._super
		console.log('StocksInput init')
		@.this.validate
	validate: () -> 
		console.log("StocksInput.valid")
		if this.get('social_stock') == undefined || this.get('social_stock') == ''
			return 'Input required a valid Social Stock name or id.'
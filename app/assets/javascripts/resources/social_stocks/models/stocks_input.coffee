SocialStocks.StocksInput = Ember.Object.extend
	social_stock: 'cat'
	init: () ->
		@._super
		@.this.validate
	validate: () -> 
		if this.get('social_stock') == undefined || this.get('social_stock') == ''
			return 'Input required a valid Social Stock name or id.'
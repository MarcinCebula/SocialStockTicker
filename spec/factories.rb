FactoryGirl.define do

	Factory.sequence(:user) { |n| "user#{n}" }

	factory :example do
		name "Generic Example"
		description "Generic Example, tests for issues that may be caused by the testing framework and its componenets"
		user { FactoryGirl.generate :user }
		project "SocialStockTicker"
		email "GenericEmail@gmail.com"
		revision 1
	end

end
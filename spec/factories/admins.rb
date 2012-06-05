# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :admin do
  	email "socialstockticker@email.com"
  	password "password123"
  	password_confirmation "password123" 
  end
end

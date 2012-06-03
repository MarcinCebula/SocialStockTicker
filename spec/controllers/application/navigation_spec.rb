require 'spec_helper'
require 'capybara/rspec'

describe "Navigation Requests Spec", :type => :request do

	before(:each) do
		visit '/'		
	end
	describe ".navbar" do
	  it "should contain button Create Listing" do
	    within '.navbar' do
	      page.should have_link('Create Listing')
	    end
	  end
	  it "should contain button Log In" do
	    within '.navbar' do
	      page.should have_link('Log In')
	    end
	  end
	end

	describe "Logo" do
		it 'should link back to root_path' do
			visit '/authentications'
			within('.navbar') do
				click_link('SocialStockTicker')
				current_path.should eq '/'
			end
		end
	end
	describe "Create Listing a:tag" do
		pending "should redirect to /listings#create_listing if user signed in"
	end

	describe "Create Listing a:tag" do
		it "should redirect to /authentications#log_in", :js => true do
			current_path.should eq '/'

			within '.navbar' do
				click_link('Log In')
			end
			"#{current_path}#{page.current_js_route}".should eq '/authentications#login'
		end
	end
end
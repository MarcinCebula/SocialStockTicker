require 'spec_helper'
require 'capybara/rspec'

describe "Navigation Requests Spec", :type => :request do

	describe ".navbar" do
	  it "should contain link Home" do
			visit '/'		
	    within '.navbar' do
	      page.should have_link('Home')
	    end
	  end
	  it "should contain link Docs" do
			visit '/'		
	    within '.navbar' do
	      page.should have_link('Docs')
	    end
	  end
	end

	describe "Logo" do
		it 'should link back to root_path and check that only its tab is active' do
			visit '/docs'
			within '.navbar' do
				click_link('SocialStockTicker')
				current_path.should eq '/'
			end
			page.has_css?('li.active', :text => 'Home').should be_true
			page.has_no_css?('li.active', :text => 'Docs').should be_true
		end
	end

	describe "Home a:tag" do
		it "should redirect to / check that only its tab is active" do
			visit '/docs'
			current_path.should eq '/docs'
			within '.navbar' do
				click_link('Home')
			end
			current_path.should eq '/'
			page.has_css?('li.active', :text => 'Home').should be_true
			page.has_no_css?('li.active', :text => 'Docs').should be_true
		end
	end

	describe "Docs a:tag" do
		it "should redirect to / and set the docs bar as active" do
			visit '/'
			current_path.should eq '/'
			within '.navbar' do
				click_link('Docs')
			end
			current_path.should eq '/docs'
			page.has_css?('li.active', :text => 'Docs').should be_true
			page.has_no_css?('li.active', :text => 'Home').should be_true
		end
	end
end
require "spec_helper"

describe SocialStocksController do

  describe "index" do
  	# subject { controller }
  	
    it "should route to /social_stocks { :format => 'html' } through GET" do
      { :get => "/social_stocks"}.should route_to(:controller => 'social_stocks', :action => 'index') 
    end
    it "should not route any other action" do 
      { :get => "/social_stocks"}.should_not route_to(:controller => 'social_stocks', :action => 'show') 
      { :get => "/social_stocks"}.should_not route_to(:controller => 'social_stocks', :action => 'edit') 
      { :get => "/social_stocks"}.should_not route_to(:controller => 'social_stocks', :action => 'update') 
      { :get => "/social_stocks"}.should_not route_to(:controller => 'social_stocks', :action => 'new') 
      { :get => "/social_stocks"}.should_not route_to(:controller => 'social_stocks', :action => 'delete') 
    end
  end
  
end
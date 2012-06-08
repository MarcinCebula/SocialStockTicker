require "spec_helper"

describe ApplicationController do

  describe "index" do
  	# subject { controller }
  	
    it "should route to /social_stocks { :format => 'html' } through GET" do
        { :get => '/' }.should route_to(:controller => 'social_stocks', :action => 'index')   
    end
  end
  
end
require "spec_helper"

describe ApplicationController do

  describe "index" do
  	# subject { controller }
  	
    it "should route to /listings { :format => 'html' } through GET" do
        { :get => '/' }.should route_to(:controller => 'authentications', :action => 'index')   
    end
  end
  
end
require 'spec_helper'

describe Api::V1::ExamplesController do

  describe "index" do
  	# subject { controller }
  	
    it "should route to /api/v1/example { :format => 'json' } through GET" do
      { :get => "/api/v1/examples"}.should route_to(:controller => 'api/v1/examples', :action => 'index', :format => 'json') 
    end
    it "should not route to /examples { :format => 'xml' } through GET" do
      { :get => "/api/v1/examples"}.should_not route_to(:controller => 'api/v1/examples', :action => 'index', :format => 'xml') 
    end
     it "should not route to /examples { :format => 'html' } through GET" do
      { :get => "/api/v1/examples"}.should_not route_to(:controller => 'api/v1/examples', :action => 'index', :format => 'html') 
    end     
    it "should not route to /examples { :format => 'json' } through POST" do
      { :post => "/api/v1/examples"}.should_not route_to(:controller => 'api/v1/examples', :action => 'index', :format => 'html') 
    end
  end
  
  describe "create" do
    subject { controller }
    
    it "should route to /api/v1/example { :format => 'json' } through POST" do
      { :post => "/api/v1/examples"}.should route_to(:controller => 'api/v1/examples', :action => 'create', :format => 'json') 
    end
    it "should not route to /examples { :format => 'xml' } through POST" do
      { :post => "/api/v1/examples"}.should_not route_to(:controller => 'api/v1/examples', :action => 'create', :format => 'xml') 
    end
     it "should not route to /examples { :format => 'html' } through POST" do
      { :post => "/api/v1/examples"}.should_not route_to(:controller => 'api/v1/examples', :action => 'create', :format => 'html') 
    end     
    it "should not route to /examples { :format => 'json' } through GET" do
      { :get => "/api/v1/examples"}.should_not route_to(:controller => 'api/v1/examples', :action => 'create', :format => 'html') 
    end
  end

  describe "show" do
    subject { controller }
    
    it "should route to /api/v1/example/1 { :format => 'json' } through GET" do
      { :get => "/api/v1/examples/1"}.should route_to(:controller => 'api/v1/examples', :id => "1", :action => 'show', :format => 'json') 
    end
    it "should not route to /examples/1 { :format => 'xml' } through GET" do
      { :get => "/api/v1/examples/1"}.should_not route_to(:controller => 'api/v1/examples', :id => "1", :action => 'show', :format => 'xml') 
    end
     it "should not route to /examples/1 { :format => 'html' } through GET" do
      { :get => "/api/v1/examples/1"}.should_not route_to(:controller => 'api/v1/examples', :id => "1", :action => 'show', :format => 'html') 
    end     
    it "should not route to /examples/1 { :format => 'json' } through POST" do
      { :post => "/api/v1/examples/1"}.should raise_exception(NoMethodError)
    end
  end


  describe "update" do
    subject { controller }
    it "should route to /api/v1/example/1 { :format => 'json' } through PUT" do
      { :put => "/api/v1/examples/1"}.should route_to(:controller => 'api/v1/examples', :id => "1", :action => 'update', :format => 'json') 
    end
    it "should not route to /examples/1 { :format => 'xml' } through GET" do
      { :put => "/api/v1/examples/1"}.should_not route_to(:controller => 'api/v1/examples', :id => "1", :action => 'update', :format => 'xml') 
    end
     it "should not route to /examples/1 { :format => 'html' } through GET" do
      { :put => "/api/v1/examples/1"}.should_not route_to(:controller => 'api/v1/examples', :id => "1", :action => 'update', :format => 'html') 
    end     
    it "should not route to /examples/1 { :format => 'json' } through POST" do
      { :post => "/api/v1/examples/1"}.should raise_exception(NoMethodError)
    end
  end
  
  describe "delete" do
    subject { controller }
    it "should route to /api/v1/example/1 { :format => 'json' } through DELETE" do
      { :delete => "/api/v1/examples/1"}.should route_to(:controller => 'api/v1/examples', :id => "1", :action => 'destroy', :format => 'json') 
    end
    it "should not route to /examples/1 { :format => 'xml' } through GET" do
      { :delete => "/api/v1/examples/1"}.should_not route_to(:controller => 'api/v1/examples', :id => "1", :action => 'destroy', :format => 'xml') 
    end
     it "should not route to /examples/1 { :format => 'html' } through GET" do
      { :delete => "/api/v1/examples/1"}.should_not route_to(:controller => 'api/v1/examples', :id => "1", :action => 'destroy', :format => 'html') 
    end     
  end
  


end
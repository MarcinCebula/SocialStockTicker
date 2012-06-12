require 'spec_helper'

##
## All these tests will fail as soon as graph.facebook gets updated. They pass for now
##
describe Stock do 
  before(:each) do
    @stock = FactoryGirl.create(:stock)
  end
  after(:each) { Stock.delete_all }
  
  it "should contain correct data and test the before filter" do
    @stock.page_id.should eq "22893372268"
    @stock.name.should eq "BMW"
    @stock.ptat_score.should eq 212031
    @stock.link.should eq "http://www.facebook.com/BMW"
    @stock.yesterday_ptat_score.should eq nil
    @stock.ptat_daily_change_in_percent.should eq 0.0
  end
  
  it "should not modify any data since the stock is not 23 hours old" do
    Stock.delete_all
    @stock = FactoryGirl.create(:stock, :ptat_score => 210000, :updated_at => (Time.now - 22.hours))
    
    Stock.update_ptat_score
    
    @stock.page_id.should eq "22893372268"
    @stock.name.should eq "BMW"
    @stock.ptat_score.should eq 210000
    @stock.link.should eq "http://www.facebook.com/BMW"
    @stock.yesterday_ptat_score.should eq nil
    @stock.ptat_daily_change_in_percent.should eq 0.0
  end
  
  it "should not modify any data since the stock is not 23 hours old" do
    Stock.update_ptat_score
    
    @stock.page_id.should eq "22893372268"
    @stock.name.should eq "BMW"
    @stock.ptat_score.should eq 212031
    @stock.link.should eq "http://www.facebook.com/BMW"
    @stock.yesterday_ptat_score.should eq nil
    @stock.ptat_daily_change_in_percent.should eq 0.0
  end
  
  it "should  modify data since the stock is 24 hours old" do
    Stock.delete_all
    @stock = FactoryGirl.create(:stock, :ptat_score => 210000, :updated_at => (Time.now - 24.hours))
    
    Stock.update_ptat_score
    
    @stock.reload
    @stock.page_id.should eq "22893372268"
    @stock.name.should eq "BMW"
    @stock.ptat_score.should eq 212031
    @stock.link.should eq "http://www.facebook.com/BMW"
    @stock.yesterday_ptat_score.should eq 210000
    @stock.ptat_daily_change_in_percent.should eq 0.97
  end
  it "should  modify data since the stock is 24 hours old (negative change)" do
    Stock.delete_all
    @stock = FactoryGirl.create(:stock, :ptat_score => 220000, :updated_at => (Time.now - 24.hours))
    
    Stock.update_ptat_score
    
    @stock.reload
    @stock.page_id.should eq "22893372268"
    @stock.name.should eq "BMW"
    @stock.ptat_score.should eq 212031
    @stock.link.should eq "http://www.facebook.com/BMW"
    @stock.yesterday_ptat_score.should eq 220000
    @stock.ptat_daily_change_in_percent.should eq -3.62
  end
  
  it "should test multiple updates at the same time" do
    Stock.delete_all
    @stock1 = FactoryGirl.create(:stock, 
              :page_id => "96585976469",
              :name => "Audi USA",
              :ptat_score => 142952, 
              :link => "http://www.facebook.com/audi",
              :updated_at => (Time.now - 24.hours)
            )
    @stock2 = FactoryGirl.create(:stock, 
              :page_id => "22893372268",
              :name => "BMW",
              :ptat_score => 212131, 
              :link => "http://www.facebook.com/BMW",
              :updated_at => (Time.now - 24.hours)
            )
    @stock3 = FactoryGirl.create(:stock, 
              :page_id => "22166130048",
              :name => "Ford Motor Company",
              :ptat_score => 14117, 
              :link => "http://www.facebook.com/ford",
              :updated_at => (Time.now - 24.hours)
            ) 
             
    Stock.update_ptat_score
    
    @stock1 = Stock.find(@stock1.id)          
    @stock2 = Stock.find(@stock2.id)          
    @stock3 = Stock.find(@stock3.id)          
              
    @stock1.ptat_score.should eq 142642
    @stock1.yesterday_ptat_score.should eq 142952
    @stock1.ptat_daily_change_in_percent.should eq -0.22
    
    @stock2.ptat_score.should eq 212031
    @stock2.yesterday_ptat_score.should eq 212131
    @stock2.ptat_daily_change_in_percent.should eq -0.05
    
    @stock3.ptat_score.should eq 14417
    @stock3.yesterday_ptat_score.should eq 14117
    @stock3.ptat_daily_change_in_percent.should eq 2.13              
            
  end
  
end
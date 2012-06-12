require 'spec_helper'

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
  
end
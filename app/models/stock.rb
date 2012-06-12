class Stock 
  include Mongoid::Document
  include Mongoid::Timestamps

	field :page_id, type: String
  field :name, type: String
  field :ptat_score, type: Integer
  field :link, type: String
  field :yesterday_ptat_score, type: Integer, default: nil
  field :ptat_daily_change_in_percent, type: Float, default: 0.0

  validates_presence_of :page_id
	validates_presence_of :name	
  validates_presence_of :ptat_score
  validates_presence_of :link
  validates_uniqueness_of :page_id
  
  
  def self.update_ptat_score
    #this is going to break as soon as the day changes. But it works
    self.all.each do |stock|
      puts stock.updated_at
      if((stock.updated_at + 23.hours) < Time.now)
        old_ptat_score = stock.ptat_score.to_i
        stock.yesterday_ptat_score = old_ptat_score
        stock.ptat_score = StocksLib.load_facebook_data(stock.name)
        stock.ptat_daily_change_in_percent =  sprintf "%.2f",((((stock.ptat_score - stock.yesterday_ptat_score)*1.0)/stock.yesterday_ptat_score) * 100)
        stock.save!
      end 
    end
  end
  
end

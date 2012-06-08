class Stock 
  include Mongoid::Document

	field :page_id, type: String
  field :name, type: String
  field :ptat_score, type: String
  field :link, type: String

  validates_presence_of :page_id
	validates_presence_of :name	
  validates_presence_of :ptat_score
  validates_presence_of :link
  validates_uniqueness_of :page_id
end
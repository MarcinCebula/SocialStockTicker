class Api::V1::StocksController < Api::ApisController
  
  def index
    @stocks = Stock.all
	end
	
	def create
		@stock = Stock.create!({:page_id => params[:page_id], :name => params[:name], :ptat_score => params[:ptat_score], :link => params[:link]})
	end
	
	def show
	  @stock = Stock.find(params[:id])
  end
    
  def destroy
    @stock = Stock.where({ :page_id => params[:id]})
    @delete_stock_page_id = params[:id]
    @stock.destroy
  end

end
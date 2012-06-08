class Public::V1::StocksController < ApplicationController
  
  def index
    @stocks = Stock.all
    render :json => @stocks.to_json(:only => ['page_id', 'name', 'ptat_score', 'link'])	, :callback => params[:callback] 
	end

end
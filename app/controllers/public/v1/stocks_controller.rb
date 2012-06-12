class Public::V1::StocksController < ApplicationController
  
  def index
    @stocks = Stock.all
    render :json => @stocks.to_json(:only => ['page_id', 'name', 'ptat_score', 'link', 'ptat_daily_change_in_percent'])	, :callback => params[:callback] 
	end

end
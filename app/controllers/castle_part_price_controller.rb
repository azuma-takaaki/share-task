class CastlePartPriceController < ApplicationController
  def index
    @castle_part_prices = CastlePartPrice.select("three_d_model_name", "displayed_name", "castle_part_point", "ruby_point")
    render :json => [@castle_part_prices]
  end
end

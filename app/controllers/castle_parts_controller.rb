class CastlePartsController < ApplicationController
  def create
    @castle_part = CastlePart.new(castle_part_parameters)
    if @castle_part.save
      render :json => ['succeeded in creating a castle_part']
    else
      error_messages = @castle_part.errors.full_messages
      render :json => ['failed to create a castle_part', error_messages]
    end
  end


  private
    def castle_part_parameters
      params.require(:castle_part).permit(:castle_id,
      :three_d_model_name, :position_x, :position_y, :position_z, :angle_x, :angle_y,
      :angle_z, :created_at, :updated_at)
    end
end

class CastlePartsController < ApplicationController
  def create
    if logged_in?
      if current_user().id == Castle.find(params[:castle_part][:castle_id]).user_id
        @castle_part = CastlePart.new(castle_part_parameters)
        if @castle_part.save
          render :json => ['succeeded in creating a castle_part']
        else
          error_messages = @castle_part.errors.full_messages
          render :json => ['failed to create a castle_part', error_messages]
        end
      else
        render :json => ['you cannot operate the castle of other users']
      end
    else
      render :json => ['this operation cannot be performed without logging in']
    end
  end


  private
    def castle_part_parameters
      params.require(:castle_part).permit(:castle_id,
      :three_d_model_name, :position_x, :position_y, :position_z, :angle_x, :angle_y,
      :angle_z, :created_at, :updated_at)
    end
end

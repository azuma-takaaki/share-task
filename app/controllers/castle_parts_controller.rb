class CastlePartsController < ApplicationController
  def create
    if logged_in?
      @castle = Castle.find(params[:castle_part][:castle_id])
      if current_user().id == @castle.user_id
        @castle_part = CastlePart.new(castle_part_parameters)
        if @castle.castle_part_point > 0
          begin
            ActiveRecord::Base.transaction do
              @castle.castle_part_point = @castle.castle_part_point - 1
              @castle.save!
              @castle_part.save!
            end
            render :json => ['succeeded in creating a castle_part']
          rescue => e
            error_messages = @castle_part.errors.full_messages
            render :json => ['failed to create a castle_part', error_messages]
          end
        else
          render :json => ['Cannot add castle_part without castle_part_point']
        end
      else
        render :json => ['you cannot operate the castle of other users']
      end
    else
      render :json => ['this operation cannot be performed without logging in']
    end
  end

  def update
    if logged_in?
      successful_update = true
      update_castle_parts_require.each do  |castle_part|
        castle_part_params = castle_part.permit(:id, :castle_id, :three_d_model_name, :position_x, :position_y, :position_z, :angle_x, :angle_y,
                                                :angle_z, :created_at, :updated_at)
        @castle_part = CastlePart.find_by(id: castle_part_params[:id])
        if current_user().id == Castle.find(castle_part_params[:castle_id]).user_id
          if @castle_part.update(castle_part_params)
          else
            successful_update = false
          end
        else
        end
      end
      if successful_update
        render :json => ["Successful update of castle_part"]
      else
        render :json => ["Failed to update castle_part"]
      end
    else
    end
  end

  def destroy
    if logged_in?
      begin
        ActiveRecord::Base.transaction do
          @castle_part = CastlePart.find_by(id: params[:id])
          @castle = Castle.find_by(id: @castle_part.castle_id)
          @castle.update!(castle_part_point: @castle.castle_part_point + 1)
          @castle_part.destroy!
        end
        render :json => ['succeeded in destroying a castle_part', @castle.castle_part_point]
      rescue => e
        error_messages = @castle_part.errors.full_messages + @castle.errors.full_messages
        render :json => ['failed to destroy a castle_part', error_messages]
      end
    else
      render :json => ["this operation cannot be performed without logging in"]
    end
  end


  private
    def castle_part_parameters
      params.require(:castle_part).permit(:castle_id,
      :three_d_model_name, :position_x, :position_y, :position_z, :angle_x, :angle_y,
      :angle_z, :created_at, :updated_at)
    end

    def update_castle_parts_require
      params.require(:castle_parts)
    end
end

class CastlesController < ApplicationController
  def create
    if logged_in?
      @castle = Castle.new(castle_parameters)
      @castle.user_id = current_user().id
      if @castle.save
        render json: ["城を立てました！"]
      else
        render json: ["失敗しました！"]
      end
    else
      render :json => ["その操作はログインしていないとできません"]
    end
  end

  def get_group_castle_list
    @castles = Castle.joins(:user)
                     .select("users.id AS user_id, users.name AS user_name, users.icon, castles.*")
                     .where(group_id: params[:group_id])
    render json: [@castles]
  end

  def get_user_castle_list
    @castle_part_list = Castle.left_joins(:castle_parts)
                     .select("castles.name, castles.id AS castle_id, castle_parts.three_d_model_name, castle_parts.position_x, castle_parts.position_y, castle_parts.position_z, castle_parts.angle_x, castle_parts.angle_y, castle_parts.angle_z ")
                     .where(user_id: params[:user_id])

    @tmp_castle_part = {}
    @castle_part_list.each do |castle_part|
      @tmp_castle_part[(castle_part.castle_id).to_s] = {castle: {castle_name: castle_part.name, castle_id: castle_part.castle_id}, models:[]}

      logger.debug(castle_part.name+"/"+castle_part.castle_id.to_s)
    end

    @castle_part_list.each do |castle_part|
      @tmp_castle_part[(castle_part.castle_id).to_s][:models].push({three_d_model_name: castle_part.three_d_model_name,
                                                                    position_x: castle_part.position_x,
                                                                    position_y: castle_part.position_y,
                                                                    position_z: castle_part.position_z,
                                                                    angle_x: castle_part.angle_x,
                                                                    angle_y: castle_part.angle_y,
                                                                    angle_z: castle_part.angle_z,
                                                                  })
    end

    @castles = []
    counter = 0
    @tmp_castle_part.each do |part|
      @castles[counter] = part[1]
      counter = counter + 1
    end

    @castles.each do |castle|
      logger.debug(castle)
    end

    @user = User.find_by(id: params[:user_id])
    render json: [@castles, @user]
  end



  private
    def castle_parameters
      params.require(:castle).permit(:name, :group_id)
    end
end

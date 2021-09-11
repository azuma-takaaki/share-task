class CastlesController < ApplicationController
  def create
    if logged_in?
      @castle = Castle.new(castle_parameters)
      initial_castle_part_point = 0
      @castle.castle_part_point = initial_castle_part_point
      @castle.user_id = current_user().id
      begin
        ActiveRecord::Base.transaction do
          @group_user_is_nil = GroupUser.find_by(group_id: params[:castle][:group_id], user_id:@castle.user_id).nil?
          if @group_user_is_nil
            @group_user = GroupUser.new(group_id: params[:castle][:group_id], user_id:@castle.user_id)
            @group_user.save!
          end
          @castle.save!
        end
        if @group_user_is_nil
          render :json => ['succeeded in creating a castle and group_user']
        else
          render :json => ['succeeded in creating a castle']
        end
      rescue => e
        error_messages = []
        if @group_user_is_nil
          error_messages = [@castle.errors.full_messages]
        else
          error_messages = [@castle.errors.full_messages, @group_user.errors.full_messages]
        end
        render :json => ['failed to create a castle or group_user', error_messages]
      end
    else
      render :json => ["その操作はログインしていないとできません"]
    end
  end

  def destroy
    if logged_in?
      begin
        ActiveRecord::Base.transaction do
          @castles_number = Castle.where(group_id: params[:castle][:group_id], user_id: params[:castle][:user_id]).count
          if @castles_number == 1
            @group_user = GroupUser.find_by(group_id: params[:castle][:group_id], user_id: params[:castle][:user_id])
            @group_user.destroy!
          end
          @castle = Castle.find_by(id: params[:id])
          @castle.destroy!
        end
        if @castles_number == 1
          render :json => ['succeeded in destroying a castle and group_user']
        else
          render :json => ['succeeded in destroying a castle']
        end
      rescue => e
        castles_number = []
        if @castles_number == 1
          error_messages = [@castle.errors.full_messages, @group_user.errors.full_messages]
        else
          error_messages = [@castle.errors.full_messages]
        end
        render :json => ['failed to destroy a castle or group_user', error_messages]
      end
    else
      render :json => ["その操作はログインしていないとできません"]
    end
  end

  def update
    if logged_in?
      @castle = Castle.find_by(id: params[:id], user_id: current_user().id)
      if @castle.nil?
        render :json => ["Failed to update the castle", ["編集する城が見つかりませんでした"]]
      else
        if @castle.update(update_parameters)
          render :json => ["Succeeded in updating the castle"]
        else
          render :json => ["Failed to update the castle", @castle.errors.full_messages]
        end
      end
    else
      render :json => ["Failed to update the castle", ["その操作はログインしていないとできません"]]
    end
  end

  def get_group_castle_list
    @castle_part_list = Castle.left_joins(:castle_parts, :user)
                              .select("users.id AS user_id, users.name AS user_name, users.icon, castles.name, castles.id AS castle_id, castle_parts.three_d_model_name, castle_parts.position_x, castle_parts.position_y, castle_parts.position_z, castle_parts.angle_x, castle_parts.angle_y, castle_parts.angle_z")
                              .where(group_id: params[:group_id])



    @tmp_castle_part = {}
    @castle_part_list.each do |castle_part|
      @tmp_castle_part[(castle_part.castle_id).to_s] = {castle:
                                                          {castle_name: castle_part.name,
                                                           castle_id: castle_part.castle_id},
                                                        models:[],
                                                        user:
                                                          {user_id:castle_part.user_id,
                                                           user_name:castle_part.user_name,
                                                           user_icon:castle_part.icon},
                                                        report:
                                                          {current_report:
                                                            {content: nil,
                                                             created_at: nil,
                                                             all_like_number: nil},
                                                          all_report_number: nil}
                                                        }
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
    all_reports = Report.all.order(created_at: :desc).to_a
    all_likes = Like.all.to_a
    all_reports.each do |report|
      logger.debug("castle_id: "+ report.castle_id.to_s + "/ "+ report.content)
    end
    @tmp_castle_part.each do |castle_part|
      reports = all_reports.select {|report| report.castle_id == castle_part[0].to_i}
      if (reports.size.to_i>0) then
        castle_part[1][:report][:all_report_number] =  reports.size.to_s
        castle_part[1][:report][:current_report] =  {content: reports[0]["content"],
                                                     created_at: reports[0]["created_at"].strftime('%Y/%m/%d'),
                                                     all_like_number: (all_likes.select { |like| like.report_id == reports[0]["id"] }).count
                                                    }
      end
      @castles[counter] = castle_part[1]
      counter = counter + 1
    end

    @castles.each do |castle|
      logger.debug(castle)
    end

    render json: [@castles]
  end

  def get_user_castle_list
    @castle_part_list = Castle.left_joins(:castle_parts)
                     .select("castles.name, castles.id AS castle_id, castles.castle_part_point, castle_parts.id, castle_parts.three_d_model_name, castle_parts.position_x, castle_parts.position_y, castle_parts.position_z, castle_parts.angle_x, castle_parts.angle_y, castle_parts.angle_z ")
                     .where(user_id: params[:user_id])

    @report_list = Castle.left_joins(:reports)
                    .select("castles.id AS castle_id, reports.content ")
                    .where(user_id: params[:user_id])

    @tmp_castle_part = {}
    @castle_part_list.each do |castle_part|
      @tmp_castle_part[(castle_part.castle_id).to_s] = {castle: {castle_name: castle_part.name, castle_id: castle_part.castle_id, castle_part_point: castle_part.castle_part_point}, models:[], reports:[]}

      logger.debug(castle_part.name+"/"+castle_part.castle_id.to_s)
    end

    @castle_part_list.each do |castle_part|
      @tmp_castle_part[(castle_part.castle_id).to_s][:models].push({id: castle_part.id,
                                                                    three_d_model_name: castle_part.three_d_model_name,
                                                                    position_x: castle_part.position_x,
                                                                    position_y: castle_part.position_y,
                                                                    position_z: castle_part.position_z,
                                                                    angle_x: castle_part.angle_x,
                                                                    angle_y: castle_part.angle_y,
                                                                    angle_z: castle_part.angle_z,
                                                                  })
    end

    @report_list.each do |report|
      @tmp_castle_part[(report.castle_id).to_s][:reports].push({content: report.content})
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

    def update_parameters
      params.require(:castle).permit(:name)
    end
end

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
    @castles = Castle.where(group_id: params[:group_id])
    render json: [@castles]
  end

  def get_user_castle_list
    @castles = Castle.where(user_id: params[:user_id])
    render json: [@castles]
  end



  private
    def castle_parameters
      params.require(:castle).permit(:name, :group_id)
    end
end

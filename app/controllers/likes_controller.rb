class LikesController < ApplicationController
  def create
    if logged_in?
      @like = Like.new(secure_like_infomation)
      if @like.save
        render :json => ["Successful registration of like"]
      else
        render :json => ["failed to register like"]
      end
    else
      render :json => ["this operation cannot be performed without logging in"]
    end
  end

  def destroy
    if logged_in?
      @like = Like.find_by(id: params[:id])
      if @like.destroy
        render :json => ["success to destroy like"]
      else
        render :json => ["failed to destroy like"]
      end
    else
      render :json => ["this operation cannot be performed without logging in"]
    end
  end

  private
    def secure_like_infomation
      params.require(:like).permit(:user_id,:report_id)
    end

end

class LikesController < ApplicationController
  def create
    if logged_in?
      @like = Like.new(secure_like_infomation)
      @like.user_id = current_user().id
      if @like.save
        likes_number = Like.where(report_id: params[:like][:report_id]).count
        render :json => ["Successful registration of like", likes_number]
      else
        render :json => ["Failed to register like", @like.errors.full_messages]
      end
    else
      render :json => ["this operation cannot be performed without logging in"]
    end
  end

  def destroy
    if logged_in?
      @like = Like.find_by(secure_like_infomation)
      if @like.destroy
        likes_number = Like.where(report_id: params[:like][:report_id]).count
        render :json => ["Success to destroy like", likes_number]
      else
        render :json => ["Failed to destroy like"]
      end
    else
      render :json => ["this operation cannot be performed without logging in"]
    end
  end

  private
    def secure_like_infomation
      params.require(:like).permit(:report_id)
    end

end

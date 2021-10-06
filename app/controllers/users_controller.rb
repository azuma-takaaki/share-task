require 'open-uri'
class UsersController < ApplicationController
  def new
    @user = User.new()
  end

  def create
    @user = User.new(secure_user_infomation)
    @user.icon = "icon_"+rand(0...10).to_s+".png"
    if @user.save
      log_in(@user)
      #flash[:danger] = 'アカウントを登録しました'
      render :json => [@user.groups, @user]
    else
      #flash[:danger] = ['アカウント登録できませんでした'].push(@user.errors.full_messages)
      render :json => ['アカウント登録できませんでした', @user.errors.full_messages]
    end
  end

  def show
    if logged_in?
      @user = current_user()
      render :json => [@user.groups, @user]
    else
      redirect_to login_page_path
    end
  end

  def edit
    @user = User.find_by(id: params[:id])
  end


  def update
    if logged_in?
      @user = User.find_by(id: params[:id])
      if params[:user][:update] == "icon"
        data_url = params[:user][:image]
        png      = Base64.decode64(data_url['data:image/png;base64,'.length .. -1])
        File.open('app/assets/images/default/icon_' + @user.id.to_s + '.png', 'wb') { |f| f.write(png) }
        if @user.update(icon: "icon_" + @user.id.to_s + ".png")
          logger.debug "アップデートしたユーザーの情報: #{@user.to_json}"
          render :json => [@user]
        else
          render :json => ["failed to update"]
        end
      else
        if @user.update(update_params)
          logger.debug "アップデートしたユーザーの情報: #{@user.to_json}"
          render :json => [@user]
        else
          render :json => ["failed to update"]
        end
      end
    else
      redirect_to top_path
    end
  end

  def logout
    log_out
    redirect_to top_path
  end

  def destroy
    @user = User.find_by(id: params[:id])
    if @user.destroy
      log_out
      flash[:danger] = "アカウントを削除しました"
      redirect_to top_path
    else
      flash[:danger] = @user.errors.full_messages
      redirect_to edit_user_path(@user)
    end
  end

  def all_user
    if logged_in?
      @users = User.all
      render :json => [@users]
      logger.debug "全ユーザー: #{@users.to_json}"
    end
  end

  def get_group_list
    if logged_in?
      @user = current_user()
      render :json => [@user.groups]
    end
  end


  def random_number
    @random_number = rand(1000)

  end



  private
    def secure_user_infomation
      params.require(:user).permit(:name,:email,:password,:password_confirmation)
    end

    def update_params
        params.require(:user).permit(:name)
    end

end

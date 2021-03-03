class UsersController < ApplicationController
  def new
    @user = User.new()
  end

  def create
    @user = User.new(secure_user_infomation)
    if @user.save
      log_in(@user)
      redirect_to @user
    else
      flash[:danger] = @user.errors.full_messages
      redirect_to new_user_path
    end
  end

  def show
    if logged_in?
      @user = current_user()
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
      if @user.update(update_params)
        redirect_to @user
      else
        flash[:danger] = @user.errors.full_messages
        redirect_to edit_user_path(@user)
      end
    else
      redirect_to top_path
    end
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



  private
    def secure_user_infomation
      params.require(:user).permit(:name,:email,:password,:password_confirmation)
    end

    def update_params
        params.require(:user).permit(:name)
    end

end

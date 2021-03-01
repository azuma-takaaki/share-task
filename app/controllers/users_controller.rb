class UsersController < ApplicationController
  def new
    @user = User.new()
  end

  def create
    @user = User.new(secure_user_infomation)
    if @user.save
      redirect_to @user
    else
      redirect_to new_user_path
    end
  end

  def show

  end

  private
    def secure_user_infomation
      params.require(:user).permit(:name,:email,:password,:password_confirmation)
    end

end

class SessionsController < ApplicationController
  def login_page
  end

  def login
    user = User.find_by(email: params[:session][:email])
    if user && user.authenticate(params[:session][:password])
      log_in(user)
      flash[:danger] = 'ログインしました'
      redirect_to  user_path(user)
    else
      flash[:danger] = 'ログインできませんでした'
      redirect_to top_path
    end
  end
end

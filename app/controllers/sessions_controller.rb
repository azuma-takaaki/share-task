class SessionsController < ApplicationController
  def login_page
  end

  def login
    user = User.find_by(email: params[:session][:email])
    if user && user.authenticate(params[:session][:password])
      log_in(user)
      redirect_to  user_path(user)
    else
      redirect_to top_path
    end
  end
end

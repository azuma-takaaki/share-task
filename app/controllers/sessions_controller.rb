class SessionsController < ApplicationController
  def login_page
  end

  def login
    user = User.find_by(email: params[:session][:email])
    if user && user.authenticate(params[:session][:password])
      log_in(user)
      #flash[:danger] = 'ログインしました'
      render :json => [user.groups, user]
    else
      #flash[:danger] = 'ログインできませんでした'
      error_messages = []
      if params[:session][:email] == ''
        error_messages.push('メールアドレスを入力してください')
      end
      if params[:session][:password] == ''
        error_messages.push('パスワードを入力してください')
      end
      if !(params[:session][:email] == '') && !(params[:session][:password] == '')
        error_messages.push('メールアドレスまたはパスワードが間違っています')
      end
      render :json => ['ログインできませんでした', error_messages]
    end
  end
end

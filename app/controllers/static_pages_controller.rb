class StaticPagesController < ApplicationController
  def top
    if logged_in?
      @twitter_accounts = TwitterToken.where(user_id: current_user().id).select(:id, :account_name)
      @user = current_user
    else
      @page_title="top"
    end

  end
end

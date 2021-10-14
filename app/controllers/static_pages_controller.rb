class StaticPagesController < ApplicationController
  def top
    if logged_in?
      @twitter_accounts
      if Rails.env != 'test'
        @twitter_accounts = TwitterToken.where(user_id: current_user().id).select(:id, :account_name)
      end
      @user = current_user
    else
      @page_title="top"
    end

  end
end

class StaticPagesController < ApplicationController
  def top
    if logged_in?
      @user = current_user
    else
      @page_title="top"
    end

  end
end

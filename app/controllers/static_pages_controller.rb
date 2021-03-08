class StaticPagesController < ApplicationController
  def top
    if logged_in?
      redirect_to current_user
    else
      @page_title="top"
    end

  end
end

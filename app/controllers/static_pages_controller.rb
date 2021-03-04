class StaticPagesController < ApplicationController
  def top
    if logged_in?
      redirect_to current_user
    end
  end
end

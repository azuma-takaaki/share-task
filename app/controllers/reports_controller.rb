class ReportsController < ApplicationController
  def create
    if logged_in?
      @report = Report.new(secure_report_params)
      if @report.save
        render :json => ["Successful registration of report"]
      else
        render :json => ["Report registration failed"]
      end
    else
      render :json => ["this operation cannot be performed without logging in"]
    end
  end

  private
    def secure_report_params
      params.require(:report).permit(:content,:user_id,:castle_id)
    end
end

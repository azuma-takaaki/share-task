class ReportsController < ApplicationController
  def create
    if logged_in?
      @report = Report.new(secure_report_params)
      @castle = Castle.find_by(id: params[:report][:castle_id])
      @latest_report = @castle.reports.order(created_at: :desc).limit(1)[0]
      if @latest_report == nil || (@latest_report != nil && @latest_report.created_at.strftime('%Y/%m/%d').to_s != Time.now.strftime('%Y/%m/%d').to_s)
        begin
          ActiveRecord::Base.transaction do
            @report.save!
            pre_num = @castle.castle_part_point
            @castle.castle_part_point = @castle.castle_part_point + 1
            p "castle_part_point: " + pre_num.to_s + "=> " + @castle.castle_part_point.to_s
            @castle.save!
          end
          render :json => ["Successful registration of report"]
        rescue => e
          render :json => ["Report registration failed in transaction processing", e]
        end
      else
        render :json => ["Reports can only be registered once a day"]
      end
    else
      render :json => ["this operation cannot be performed without logging in"]
    end
  end

  def update
    if logged_in?
      @report = Report.find(params[:id])
      if @report.update(content: params[:content])
        render :json => ["Success to update content", @report]
      else
        render :json => ["Failed to update content"]
      end
    end
  end

  private
    def secure_report_params
      params.require(:report).permit(:content,:user_id,:castle_id)
    end
end

require 'rails_helper'

RSpec.describe ReportsController, type: :request do
  describe "#create" do
    before do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      @castle = FactoryBot.create(:castle0, user: @user, group: @group)
    end
    describe "#valid_infomation" do
      example "正しい情報は登録ができる" do
        post login_path , params: { session: {
                                          email: @user.email,
                                          password: @user.password,
                                        }}
        expect(response).to have_http_status(200)
        pre_number_of_record = Report.all.length
        post reports_path, params: { report: {
                                      content: "プログラミングを1時間した！",
                                      user_id: @user.id,
                                      castle_id: @castle.id
                                    }}
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)[0]).to eq "Successful registration of report"
        expect(Report.all.length).to eq pre_number_of_record+1
      end

      example "reportを登録した時に1日に1度castle_part_pointが増える" do

        puts "普通にreportをポストする->成功を確認"

        post login_path , params: { session: {
                                          email: @user.email,
                                          password: @user.password,
                                        }}
        expect(response).to have_http_status(200)
        pre_number_of_record = Report.all.length
        pre_castle_part_point = @castle.castle_part_point
        post reports_path, params: { report: {
                                      content: "プログラミングを1時間した！",
                                      user_id: @user.id,
                                      castle_id: @castle.id
                                    }}
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)[0]).to eq "Successful registration of report"
        expect(Report.all.length).to eq pre_number_of_record+1
        expect(@castle.reload.castle_part_point).to eq pre_castle_part_point+1

        puts "普通にreportをポストする->失敗を確認(一日一つまでというメッセージが帰ってくる)"

        pre_number_of_record = Report.all.length
        pre_castle_part_point = @castle.castle_part_point
        post reports_path, params: { report: {
                                      content: "プログラミングを2時間した！",
                                      user_id: @user.id,
                                      castle_id: @castle.id
                                    }}
        expect(JSON.parse(response.body)[0]).to eq "Reports can only be registered once a day"
        expect(Report.all.length).to eq pre_number_of_record
        expect(@castle.reload.castle_part_point).to eq pre_castle_part_point

        puts ""
        puts "次の日にtravel"
        travel_to Time.now + 1.day
        puts "普通にreportをポストする->成功を確認"
        post login_path , params: { session: {
                                          email: @user.email,
                                          password: @user.password,
                                        }}
        expect(response).to have_http_status(200)
        pre_number_of_record = Report.all.length
        pre_castle_part_point = @castle.castle_part_point
        post reports_path, params: { report: {
                                      content: "プログラミングを1時間した！",
                                      user_id: @user.id,
                                      castle_id: @castle.id
                                    }}
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)[0]).to eq "Successful registration of report"
        expect(Report.all.length).to eq pre_number_of_record+1
        expect(@castle.reload.castle_part_point).to eq pre_castle_part_point+1

        puts "普通にreportをポストする->失敗を確認(一日一つまでというメッセージが帰ってくる)"

        pre_number_of_record = Report.all.length
        pre_castle_part_point = @castle.castle_part_point
        post reports_path, params: { report: {
                                      content: "プログラミングを2時間した！",
                                      user_id: @user.id,
                                      castle_id: @castle.id
                                    }}
        expect(JSON.parse(response.body)[0]).to eq "Reports can only be registered once a day"
        expect(Report.all.length).to eq pre_number_of_record
        expect(@castle.reload.castle_part_point).to eq pre_castle_part_point

        puts ""
        puts "次の月にtravel"
        travel_to Time.now + 1.month
        puts "普通にreportをポストする->成功を確認"
        post login_path , params: { session: {
                                          email: @user.email,
                                          password: @user.password,
                                        }}
        expect(response).to have_http_status(200)
        pre_number_of_record = Report.all.length
        pre_castle_part_point = @castle.castle_part_point
        post reports_path, params: { report: {
                                      content: "プログラミングを1時間した！",
                                      user_id: @user.id,
                                      castle_id: @castle.id
                                    }}
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)[0]).to eq "Successful registration of report"
        expect(Report.all.length).to eq pre_number_of_record+1
        expect(@castle.reload.castle_part_point).to eq pre_castle_part_point+1

        puts "普通にreportをポストする->失敗を確認(一日一つまでというメッセージが帰ってくる)"

        pre_number_of_record = Report.all.length
        pre_castle_part_point = @castle.castle_part_point
        post reports_path, params: { report: {
                                      content: "プログラミングを2時間した！",
                                      user_id: @user.id,
                                      castle_id: @castle.id
                                    }}
        expect(JSON.parse(response.body)[0]).to eq "Reports can only be registered once a day"
        expect(Report.all.length).to eq pre_number_of_record
        expect(@castle.reload.castle_part_point).to eq pre_castle_part_point

        puts ""
        puts "次の年にtravel"
        travel_to Time.now + 1.year
        puts "普通にreportをポストする->成功を確認"
        post login_path , params: { session: {
                                          email: @user.email,
                                          password: @user.password,
                                        }}
        expect(response).to have_http_status(200)
        pre_number_of_record = Report.all.length
        pre_castle_part_point = @castle.castle_part_point
        post reports_path, params: { report: {
                                      content: "プログラミングを1時間した！",
                                      user_id: @user.id,
                                      castle_id: @castle.id
                                    }}
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)[0]).to eq "Successful registration of report"
        expect(Report.all.length).to eq pre_number_of_record+1
        expect(@castle.reload.castle_part_point).to eq pre_castle_part_point+1

        puts "普通にreportをポストする->失敗を確認(一日一つまでというメッセージが帰ってくる)"

        pre_number_of_record = Report.all.length
        pre_castle_part_point = @castle.castle_part_point
        post reports_path, params: { report: {
                                      content: "プログラミングを2時間した！",
                                      user_id: @user.id,
                                      castle_id: @castle.id
                                    }}
        expect(JSON.parse(response.body)[0]).to eq "Reports can only be registered once a day"
        expect(Report.all.length).to eq pre_number_of_record
        expect(@castle.reload.castle_part_point).to eq pre_castle_part_point


      end
    end

    describe "#invalid_infomation" do
      example "ログインしていないと登録できない" do
        pre_number_of_record = Report.all.length
        post reports_path, params: { report: {
                                      content: "プログラミングを1時間した！",
                                      user_id: @user.id,
                                      castle_id: @castle.id
                                    }}
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)[0]).to eq "this operation cannot be performed without logging in"
        expect(Report.all.length).to eq pre_number_of_record
      end
    end
  end

  describe "#update" do
    before do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      @castle = FactoryBot.create(:castle0, user: @user, group: @group)
    end

    example "Reportのcontentを編集できる" do
      post login_path , params: { session: {
                                        email: @user.email,
                                        password: @user.password,
                                      }}
      expect(response).to have_http_status(200)
      pre_number_of_record = Report.all.length
      post reports_path, params: { report: {
                                    content: "プログラミングを1時間した！",
                                    user_id: @user.id,
                                    castle_id: @castle.id
                                  }}
      expect(response).to have_http_status(200)
      expect(JSON.parse(response.body)[0]).to eq "Successful registration of report"
      expect(Report.all.length).to eq pre_number_of_record+1

      @report = Report.find_by(content: "プログラミングを1時間した！")
      new_report_content =  "プログラミングを10時間勉強した"
      patch "/reports/" + @report.id.to_s, params: { content: new_report_content}
      expect(response).to have_http_status(200)
      expect(@report.reload.position_x).to eq new_report_content
    end
  end
end

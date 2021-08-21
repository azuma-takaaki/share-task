require 'rails_helper'

RSpec.describe SessionsController, type: :request do
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
end

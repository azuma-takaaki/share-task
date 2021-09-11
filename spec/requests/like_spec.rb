require 'rails_helper'

RSpec.describe LikesController, type: :request do
  describe "#create" do
    before do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      @castle = FactoryBot.create(:castle0, user: @user, group: @group)
    end

    describe "#valid_infomation" do
      example "正しくいいねを登録できる" do
        post login_path , params: { session: {
                                          email: @user.email,
                                          password: @user.password,
                                        }}
        expect(response).to have_http_status(200)
        post reports_path, params: { report: {
                                      content: "プログラミングを1時間した！",
                                      user_id: @user.id,
                                      castle_id: @castle.id
                                    }}

        @report = Report.find_by(content: "プログラミングを1時間した！")
        pre_number_of_like = Like.all.length
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)[0]).to eq "Successful registration of report"

        post likes_path, params: {like: {
                                    user_id: @user.id,
                                    report_id: @report.id
                                 }}
        expect(response).to have_http_status(200)
        expect(Like.all.length).to eq pre_number_of_like+1
      end
    end
  end
  describe "#destroy" do
    before do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      @castle = FactoryBot.create(:castle0, user: @user, group: @group)
    end

    describe "#valid_infomation" do
      example "正しくいいねを解除できる" do
        post login_path , params: { session: {
                                          email: @user.email,
                                          password: @user.password,
                                        }}
        expect(response).to have_http_status(200)
        post reports_path, params: { report: {
                                      content: "プログラミングを1時間した！",
                                      user_id: @user.id,
                                      castle_id: @castle.id
                                    }}

        @report = Report.find_by(content: "プログラミングを1時間した！")
        pre_number_of_like = Like.all.length
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)[0]).to eq "Successful registration of report"

        post likes_path, params: {like: {
                                    user_id: @user.id,
                                    report_id: @report.id
                                 }}
        expect(response).to have_http_status(200)
        expect(Like.all.length).to eq pre_number_of_like+1

        pre_number_of_like = Like.all.length
        @likes = Like.find_by(user_id: @user.id, report_id: @report.id)
        delete "/likes/" + @likes.id.to_s, params: {like: {
                                                      user_id: @user.id,
                                                      report_id: @report.id
                                                   }}
        expect(response).to have_http_status(200)
        expect(Like.all.length).to eq pre_number_of_like-1
      end
    end
  end
end

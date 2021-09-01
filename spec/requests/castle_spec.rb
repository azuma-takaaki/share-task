require 'rails_helper'

RSpec.describe CastlesController, type: :request do
  describe "#get_castles" do
    before do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      @castle = FactoryBot.create(:castle0, user: @user, group: @group)
    end

    example "グループの城に最新の積み上げ, 投稿の時間, 総積み上げ数が表示される" do
      post login_path , params: { session: {
                                        email: @user.email,
                                        password: @user.password,
                                      }}
      expect(response).to have_http_status(200)
      for day in 1..5 do
        pre_number_of_record = Report.all.length
        post reports_path, params: { report: {
                                      content: "プログラミングを"+day.to_s+"時間した！",
                                      user_id: @user.id,
                                      castle_id: @castle.id
                                    }}
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)[0]).to eq "Successful registration of report"
        expect(Report.all.length).to eq pre_number_of_record+1
        travel_to Time.now + 1.day
      end
      get "/get_group_castle_list/" + @group.id.to_s
      expect(response).to have_http_status(200)
      expect(JSON.parse(response.body)[0][0]["report"]["all_report_number"]).to eq "5"
      expect(JSON.parse(response.body)[0][0]["report"]["current_report"]["content"]).to eq "プログラミングを5時間した！"
    end

  end

  describe "#create_castle" do
    example "城を作成した際, group_userが存在しなければ追加する" do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      pre_number_of_group_user = GroupUser.all.length
      post login_path , params: { session: {
                                        email: @user.email,
                                        password: @user.password,
                                      }}

      post "/castles", params: { castle: { name: "バックエンドマスター", group_id: @group.id }}
      expect(response).to have_http_status(200)
      expect(JSON.parse(response.body)[0]).to eq "succeeded in creating a castle and group_user"
      expect(GroupUser.all.length).to eq pre_number_of_group_user + 1

      pre_number_of_group_user = GroupUser.all.length
      post "/castles", params: { castle: {  name: "フロントエンドマスター", group_id: @group.id }}
      expect(response).to have_http_status(200)
      expect(GroupUser.all.length).to eq pre_number_of_group_user
    end
  end

  describe "#remove_castle" do
    example "城を削除しそのグループに自分の城がなくなる場合, group_userも削除する" do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      @castle_0 = FactoryBot.create(:castle0, user:@user, group:@group)
      @castle_1 = FactoryBot.create(:castle1, user:@user, group:@group)
      @group_user = FactoryBot.create(:group_user, group_id: @group.id, user_id: @user.id)
      post login_path , params: { session: {
                                        email: @user.email,
                                        password: @user.password,
                                      }}

      pre_number_of_group_user = GroupUser.all.length
      delete "/castles/" + @castle_0.id.to_s, params: { castle: { user_id: @user.id, group_id: @group.id }}
      expect(response).to have_http_status(200)
      expect(JSON.parse(response.body)[0]).to eq "succeeded in destroying a castle"
      expect(GroupUser.all.length).to eq pre_number_of_group_user


      pre_number_of_group_user = GroupUser.all.length
      delete "/castles/" + @castle_1.id.to_s, params: { castle: { user_id: @user.id, group_id: @group.id }}
      expect(response).to have_http_status(200)
      expect(JSON.parse(response.body)[0]).to eq "succeeded in destroying a castle and group_user"
      expect(GroupUser.all.length).to eq pre_number_of_group_user - 1
    end
  end
end

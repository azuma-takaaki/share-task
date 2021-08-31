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


    example "城の数が多いグループ上位10グループを取得することができる" do
      @groups = []
      @user = FactoryBot.create(:user)
      @groups_number = 20
      for i in 1..@groups_number do
        @groups[i] = FactoryBot.create(:group, name: "group"+ i.to_s)
        for n in 1..i do
          FactoryBot.create(:castle0, name: "group"+ i.to_s + "_castle" + n.to_s,
                            castle_part_point: 0,
                            user: @user,
                            group: @groups[i])
        end
      end
      get "/get_popular_groups"
      expect(response).to have_http_status(200)
      for i in 0..9 do
        expect(JSON.parse(response.body)[i]["group_name"]).to eq "group"+ (@groups_number-i).to_s
      end
    end

  end
end

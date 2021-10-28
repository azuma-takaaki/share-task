require 'rails_helper'


RSpec.describe GroupsController, type: :request do
  describe "#get_groups" do
    before do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      @castle = FactoryBot.create(:castle0, user: @user, group: @group)
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
        expect(JSON.parse(response.body)[0][i]["name"]).to eq "group"+ (@groups_number-i).to_s
        expect(JSON.parse(response.body)[0][i]["castles_number"]).to eq @groups_number-i
      end
    end
  end

  describe "#create" do
    before do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      @castle = FactoryBot.create(:castle0, user: @user, group: @group)
    end

    example "グループ名が21文字以上だとグループを作成できない" do
      post login_path , params: { session: {
                                        email: @user.email,
                                        password: @user.password,
                                      }}
      invalid_number = 21
      invalid_group_name = "a" * invalid_number
      post "/groups", params: { group: {name: invalid_group_name}}
      expect(JSON.parse(response.body)[0]).to eq "failed to create a group"
      expect(JSON.parse(response.body)[1]).to eq ["グループ名は20文字以内で入力してください"]
    end
  end
end

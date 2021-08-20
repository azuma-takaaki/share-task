require 'rails_helper'

RSpec.describe SessionsController, type: :request do
  describe "#create" do
    before do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      @castle = FactoryBot.create(:castle0, user: @user, group: @group)
    end

    example "正しい情報は登録ができる" do
      post login_path , params: { session: {
                                        email: @user.email,
                                        password: @user.password,
                                      }}
      expect(response).to have_http_status(200)
      post castle_parts_path, params: { castle_part: {
                                    castle_id: @castle.id,
                                    three_d_model_name: "castle.glb",
                                    position_x: 0,
                                    position_y: 0,
                                    position_z: 0,
                                    angle_x: 0,
                                    angle_y: 0,
                                    angle_z: 0,
                                  }}
      puts("response: " + response.body)
      expect(response).to have_http_status(200)
    end

    example "ログインしていないと登録できない" do
      post castle_parts_path, params: { castle_part: {
                                    castle_id: @castle.id,
                                    three_d_model_name: "castle.glb",
                                    position_x: 0,
                                    position_y: 0,
                                    position_z: 0,
                                    angle_x: 0,
                                    angle_y: 0,
                                    angle_z: 0,
                                  }}

      puts("response: " + response.body)
      expect(JSON.parse(response.body)[0]).to eq "this operation cannot be performed without logging in"
    end

    example "他ユーザーのcastle_partは登録できない" do
      @other_user = FactoryBot.create(:user)
      post login_path , params: { session: {
                                        email: @other_user.email,
                                        password: @other_user.password,
                                      }}
      expect(response).to have_http_status(200)
      post castle_parts_path, params: { castle_part: {
                                    castle_id: @castle.id,
                                    three_d_model_name: "castle.glb",
                                    position_x: 0,
                                    position_y: 0,
                                    position_z: 0,
                                    angle_x: 0,
                                    angle_y: 0,
                                    angle_z: 0,
                                  }}

      puts("response: " + response.body)
      expect(JSON.parse(response.body)[0]).to eq "you cannot operate the castle of other users"
    end
  end

  describe "#update" do
    before do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      @castle = FactoryBot.create(:castle0, user: @user, group: @group)
    end

    example "1つのcastle_partを正しい情報が更新できる" do
      post login_path , params: { session: {
                                        email: @user.email,
                                        password: @user.password,
                                      }}
      expect(response).to have_http_status(200)
      @castle_part = FactoryBot.create(:castle_part, castle_id: @castle.id)
      patch "/castle_parts/update", params: { castle_parts: [{
                                                              id: @castle_part.id,
                                                              castle_id: @castle.id,
                                                              three_d_model_name: "castle.glb",
                                                              position_x: 100,
                                                              position_y: 200,
                                                              position_z: 300,
                                                              angle_x: 1,
                                                              angle_y: 2,
                                                              angle_z: 3}]
                                                            }
      expect(response).to have_http_status(200)
      expect(@castle_part.reload.position_x).to eq 100
    end

    example "複数のcastle_partをまとめて更新できる" do
      post login_path , params: { session: {
                                        email: @user.email,
                                        password: @user.password,
                                      }}
      expect(response).to have_http_status(200)
      @castle_part1 = FactoryBot.create(:castle_part, castle_id: @castle.id)
      @castle_part2 = FactoryBot.create(:castle_part2, castle_id: @castle.id)
      patch "/castle_parts/update", params: { castle_parts:[
                                                                   {id: @castle_part1.id,
                                                                    castle_id: @castle.id,
                                                                    three_d_model_name: "castle.glb",
                                                                    position_x: 100,
                                                                    position_y: 200,
                                                                    position_z: 300,
                                                                    angle_x: 1,
                                                                    angle_y: 2,
                                                                    angle_z: 3},
                                                                   {id: @castle_part2.id,
                                                                    castle_id: @castle.id,
                                                                    three_d_model_name: "castle.glb",
                                                                    position_x: 100,
                                                                    position_y: 200,
                                                                    position_z: 300,
                                                                    angle_x: 1,
                                                                    angle_y: 2,
                                                                    angle_z: 3}]
                                                            }
      expect(response).to have_http_status(200)
      expect(@castle_part1.reload.position_x).to eq 100
      expect(@castle_part2.reload.position_x).to eq 100
    end
  end
end

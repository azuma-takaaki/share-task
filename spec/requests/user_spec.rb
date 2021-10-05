require 'rails_helper'

RSpec.describe ReportsController, type: :request do
  before do
    @user = FactoryBot.create(:user)
    @group = FactoryBot.create(:group)
  end

  example "画像をアップロードしてアイコンを保存できる" do
    post login_path , params: { session: {
                                      email: @user.email,
                                      password: @user.password,
                                    }}
    expect(response).to have_http_status(200)
    patch "/users/" + @user.id.to_s, params: {user: {image:"aaa"}}
    expect(response).to have_http_status(200)
    expect(@user.reload.icon).to eq "./icon_" + @user.id.to_s + ".png"
  end
end

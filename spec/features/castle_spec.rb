require 'rails_helper'

feature "Castles" , :js => true do
  before do
    visit "/"
    click_button "新規アカウント登録"
    fill_in "user_name", with:"test_user1"
    fill_in "email", with:"hogehoge1@hoge.com"
    fill_in "password", with:"password"
    fill_in "password_confirm", with:"password"
    click_button "登録"
  end

  example "グループ画面から城を作成することができる" do
    @group = FactoryBot.create(:programming)
    click_button "＜"
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    click_button "programming"
    click_button "城を立てる"
    fill_in "城の名前(目標)", with:"web開発エンジニアになる！"
    click_button "城を立てる"
  end



end

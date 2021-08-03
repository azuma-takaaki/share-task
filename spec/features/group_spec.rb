require 'rails_helper'

feature "Groups" , :js => true do
  example "Groupを探す" do
    @group = FactoryBot.create(:programming)
    expect(@group.valid?)
    visit "/"
    click_button "新規アカウント登録"
    fill_in "user_name", with:"test_user1"
    fill_in "email", with:"hogehoge1@hoge.com"
    fill_in "password", with:"password"
    fill_in "password_confirm", with:"password"
    click_button "登録"
    click_button "＜"
    find("input[placeholder='グループを探す']").set("progra").click
    expect(page).to have_content "programming"

  end
end

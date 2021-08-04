require 'rails_helper'

feature "Groups" , :js => true do
  before do
    visit "/"
    click_button "新規アカウント登録"
    fill_in "user_name", with:"test_user1"
    fill_in "email", with:"hogehoge1@hoge.com"
    fill_in "password", with:"password"
    fill_in "password_confirm", with:"password"
    click_button "登録"
  end

  example "Groupを探す" do
    @group = FactoryBot.create(:programming)
    expect(@group.valid?)
    visit "/"
    click_button "＜"
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra").click
    expect(page).to have_content "programming"
  end

  example "存在するグループ名で新しいグループを作成しようとするとエラーメッセージが表示される" do
    @group = FactoryBot.create(:programming)
    expect(@group.valid?)
    click_button "＜"
    click_on "マイグループ"
    click_button "＋group"
    fill_in "新しいグループの名前", with:"programming"
    click_button "グループを作成"
    expect(page).to have_content "その名前のグループは既に存在します"
  end
end

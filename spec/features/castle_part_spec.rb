require 'rails_helper'

feature "CastleParts" , :js => true do
  before do
    visit "/"
    click_button "新規アカウント登録"
    fill_in "user_name", with:"test_user1"
    fill_in "email", with:"hogehoge1@hoge.com"
    fill_in "password", with:"password"
    fill_in "password_confirm", with:"password"
    click_button "登録"
  end

  example "複数のcastle_partを一度にアップデートできる" do
    @group = FactoryBot.create(:programming)
    click_button "＜"
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    click_button "programming"
    find('div.bm-overlay').click
    click_button "城を建てる"
    fill_in "城の名前(目標)", with:"web開発エンジニアになる"
    find(".post-castle-data-button").click
    expect(page).to have_content "web開発エンジニアになる 城"

    page.find('.user-name', text: 'test_user1').click
    expect(page).to have_selector ".users-page-header-name", text: "test_user1"
    click_button "積み上げを登録する"
    fill_in "今日の積み上げ", with:"プログラミングを5時間勉強した！"
    click_button "登録する"
    expect(page).to have_selector ".report-content", text: "プログラミングを5時間勉強した！"
    click_button "3Dモデルを追加"
    click_button "変更を保存"
  end

end

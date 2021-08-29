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
    find('div.bm-overlay').click
    click_button "城を建てる"
    fill_in "城の名前(目標)", with:"web開発エンジニアになる"
    find(".post-castle-data-button").click
    expect(page).to have_content "web開発エンジニアになる 城"
    expect(page).to have_selector ".castle_at_group", text: "test_user1"
  end

  example "城を建てたユーザー名をクリックするとユーザー画面が表示される" do
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

    click_button "＜"
    click_button "test_user1"
    find('div.bm-overlay').click
    click_button "・・・"
    click_button "ログアウト"

    click_button "新規アカウント登録"
    fill_in "user_name", with:"test_user2"
    fill_in "email", with:"hogehoge2@hoge.com"
    fill_in "password", with:"password"
    fill_in "password_confirm", with:"password"
    click_button "登録"

    click_button "＜"
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    click_button "programming"
    find('div.bm-overlay').click
    page.find('.user-name', text: 'test_user1').click
    expect(page).to have_selector ".users-page-header-name", text: "test_user1"

  end


  example "グループに表示された城の上に最新の投稿内容とその時間と総積み上げ数が表示される" do
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
    expect(page).to have_selector ".castle_at_group", text: "test_user1"
    page.find('.user-name', text: 'test_user1').click
    expect(page).to have_selector ".users-page-header-name", text: "test_user1"
    for day in 1..5 do
      click_button "積み上げを登録する"
      fill_in "今日の積み上げ", with:"プログラミングを" + day.to_s + "時間勉強した！"
      click_button "登録する"
      expect(page).to have_selector ".report-content", text: "プログラミングを" + day.to_s + "時間勉強した！"
      travel_to Time.now + 1.day
    end
    click_button "＜"
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    click_button "programming"
    find('div.bm-overlay').click
    expect(page).to have_selector ".all-report-number", text: "5"
    expect(page).to have_selector ".current-report-content", text: "プログラミングを5時間勉強した！"
  end


end

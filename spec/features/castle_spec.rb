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
    page.find('.side-menu-toggle').click
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

  example "城を作成したグループがマイグループに追加される" do
    @group = FactoryBot.create(:programming)
    page.find('.side-menu-toggle').click
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    click_button "programming"
    find('div.bm-overlay').click
    click_button "城を建てる"
    fill_in "城の名前(目標)", with:"web開発エンジニアになる"
    find(".post-castle-data-button").click
    expect(page).to have_content "web開発エンジニアになる 城"
    expect(page).to have_selector ".castle_at_group", text: "test_user1"
    page.find('.side-menu-toggle').click
    click_on "マイグループ"
    expect(page).to have_content "programming"
  end

  example "城を建てたユーザー名をクリックするとユーザー画面が表示される" do
    @group = FactoryBot.create(:programming)
    page.find('.side-menu-toggle').click
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    click_button "programming"
    find('div.bm-overlay').click
    click_button "城を建てる"
    fill_in "城の名前(目標)", with:"web開発エンジニアになる"
    find(".post-castle-data-button").click
    expect(page).to have_content "web開発エンジニアになる 城"

    page.find('.side-menu-toggle').click
    click_button "test_user1"
    find('div.bm-overlay').click
    page.find('.edit-user-button', text: '⋯').click
    click_button "ログアウト"

    click_button "新規アカウント登録"
    fill_in "user_name", with:"test_user2"
    fill_in "email", with:"hogehoge2@hoge.com"
    fill_in "password", with:"password"
    fill_in "password_confirm", with:"password"
    click_button "登録"

    page.find('.side-menu-toggle').click
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    click_button "programming"
    find('div.bm-overlay').click
    page.find('.user-name', text: 'test_user1').click
    expect(page).to have_selector ".users-page-header-name", text: "test_user1"
  end

  example "城を削除できる" do
    @group = FactoryBot.create(:programming)
    page.find('.side-menu-toggle').click
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    click_button "programming"
    find('div.bm-overlay').click
    click_button "城を建てる"
    fill_in "城の名前(目標)", with:"web開発エンジニアになる"
    find(".post-castle-data-button").click
    expect(page).to have_content "web開発エンジニアになる 城"
    page.find('.user-name', text: 'test_user1').click
    find("#edit-web開発エンジニアになる").click
    click_button "城を削除"
    click_button "城を削除する"
    expect(page).not_to have_content "web開発エンジニアになる 城"
  end


  example "グループに表示された城の上に最新の投稿内容とその時間と総積み上げ数が表示される" do
    @group = FactoryBot.create(:programming)
    page.find('.side-menu-toggle').click
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
    page.find('.side-menu-toggle').click
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    sleep 1
    click_button "programming"
    sleep 1
    find('div.bm-overlay').click
    expect(page).to have_selector ".all-report-number", text: "5"
    expect(page).to have_selector ".current-report-content", text: "プログラミングを5時間勉強した！"

    page.find('.side-menu-toggle').click
    click_button "test_user1"
    find('div.bm-overlay').click
    page.find('.edit-user-button', text: '⋯').click
    click_button "ログアウト"
  end

  example "城の名前を変更できる" do
    @group = FactoryBot.create(:programming)
    page.find('.side-menu-toggle').click
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
    find("#edit-web開発エンジニアになる").click
    fill_in "城の名前", with:"unityエンジニアになる"
    click_button "城の名前を変更"
    expect(page).to have_content "unityエンジニアになる 城"
  end

  example "自分および他ユーザーのいいねが反映される" do
    @group = FactoryBot.create(:programming)
    page.find('.side-menu-toggle').click
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    click_button "programming"
    find('div.bm-overlay').click
    click_button "城を建てる"
    fill_in "城の名前(目標)", with:"web開発エンジニアになる"
    find(".post-castle-data-button").click
    expect(page).to have_content "web開発エンジニアになる 城"
    expect(page).to have_selector ".castle_at_group", text: "test_user1"
    expect(page).to have_selector ".report-infomation"
  end

end

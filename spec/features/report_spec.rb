require "rails_helper"


feature "Report" , :js => true do
  before do
    visit "/"
    click_button "新規アカウント登録"
    fill_in "user_name", with:"test_user1"
    fill_in "email", with:"hogehoge1@hoge.com"
    fill_in "password", with:"password"
    fill_in "password_confirm", with:"password"
    click_button "登録"
  end

  describe "#valid_infomation" do
    example "新規の積み上げ(report)を追加できる" do
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
      expect(page).to have_selector ".users-page-header-name", text: "test_user1"
      click_button "積み上げを登録する"
      fill_in "今日の積み上げ", with:"プログラミングを5時間勉強した！"
      click_button "登録する"
      expect(page).to have_selector ".report-content", text: "プログラミングを5時間勉強した！"
    end

    example "ユーザーページの積み上げにいいねボタンと投稿日時が表示される" do
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
      expect(page).to have_selector ".users-page-header-name", text: "test_user1"
      click_button "積み上げを登録する"
      fill_in "今日の積み上げ", with:"プログラミングを5時間勉強した！"
      click_button "登録する"
      expect(page).to have_selector ".report-wrapper > .report-content", text: "プログラミングを5時間勉強した！"
      expect(page).to have_selector ".report-wrapper > .report-infomation-wrapper > .like-button-and-created-at-wrapper > .like-button"
      expect(page).to have_selector ".report-wrapper > .report-infomation-wrapper > .like-button-and-created-at-wrapper > .created-at-of-report"
    end

    example "投稿した積み上げの内容を編集できる" do
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
      expect(page).to have_selector ".users-page-header-name", text: "test_user1"
      click_button "積み上げを登録する"
      fill_in "今日の積み上げ", with:"プログラミングを5時間勉強した！"
      click_button "登録する"
      expect(page).to have_selector ".report-content", text: "プログラミングを5時間勉強した！"
      page.find('.edit-report-button').click
      fill_in "積み上げを修正", with:"プログラミングを10時間勉強した！"
      find(".post-new-report-content-button").click
      expect(page).to have_selector ".report-content", text: "プログラミングを10時間勉強した！"
    end

  end
end

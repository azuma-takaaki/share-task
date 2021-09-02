require "rails_helper"


feature "Login-Logout" , :js => true do
  describe "#valid_infomation" do
    example "新規アカウント登録, ログアウト, ログインができる" do
      visit "/"
      click_button "新規アカウント登録"
      fill_in "user_name", with:"test_user1"
      fill_in "email", with:"hogehoge1@hoge.com"
      fill_in "password", with:"password"
      fill_in "password_confirm", with:"password"
      click_button "登録"
      click_button "・・・"
      click_button "ログアウト"
      click_button "ログイン"
      fill_in "email", with:"hogehoge1@hoge.com"
      fill_in "password", with:"password"
      find("#modal-login-button").click
      visit "/"
      expect(page).to have_content 'test_user1'
      click_button "＜"
    end
  end

  describe "#invalid_infomation" do
    before do
      visit "/"
      click_button "ログイン"
    end

    example "メールアドレスが空だと'メールアドレスを入力してください'とアラートが出る" do
      fill_in "password", with:"password"
      find("#modal-login-button").click
      expect(page).to have_content "メールアドレスを入力してください"
    end

    example "パスワードが空だと'パスワードを入力してください'とアラートが出る" do
      fill_in "email", with:"hogehoge@hoge.com"
      find("#modal-login-button").click
      expect(page).to have_content "パスワードを入力してください"
    end

    example "不正なデータの場合'メールアドレスまたはパスワードが間違っています'とアラートが出る" do
      fill_in "email", with:"hogehoge1@hoge.com"
      fill_in "password", with:"password"
      find("#modal-login-button").click
      expect(page).to have_content "メールアドレスまたはパスワードが間違っています"
    end
  end
end



feature "Singup" , :js => true do
  describe "#valid_infomation" do
    example "新規登録後にユーザーページが表示される" do
      visit "/"
      click_button "新規アカウント登録"
      fill_in "user_name", with:"test_user1"
      fill_in "email", with:"hogehoge@hoge.com"
      fill_in "password", with:"password"
      fill_in "password_confirm", with:"password"
      click_button "登録"
      expect(page).to have_content 'test_user1'
      click_button "・・・"
      click_button "ログアウト"
      sleep 2

      visit "/"
      click_button "新規アカウント登録"
      fill_in "user_name", with:"test_user2"
      fill_in "email", with:"fugafuga@hoge.com"
      fill_in "password", with:"password"
      fill_in "password_confirm", with:"password"
      click_button "登録"
      visit "/"
      expect(page).to have_content 'test_user2'
    end
  end


  describe "#invalid_infomation" do
    before do
      visit "/"
      click_button "新規アカウント登録"
    end

    example "名前が空だと'名前を入力してください'とアラートが出る" do
      fill_in "email", with:"hogehoge@hoge.com"
      fill_in "password", with:"password"
      fill_in "password_confirm", with:"password"
      click_button "登録"
      expect(page).to have_content '名前を入力してください'
    end

    example "データが不正で登録に失敗した後,モーダルを一度閉じて開き直すとアラートが消えている" do
      click_button "登録"
      expect(page).to have_content '名前を入力してください'
      click_button "×"
      click_button "新規アカウント登録"
      expect(page).not_to have_content '名前を入力してください'
    end
  end
end



feature "Show-own-castles" , :js => true do
  before do
    visit "/"
    click_button "新規アカウント登録"
    fill_in "user_name", with:"test_user1"
    fill_in "email", with:"hogehoge1@hoge.com"
    fill_in "password", with:"password"
    fill_in "password_confirm", with:"password"
    click_button "登録"
  end

  example "ユーザーページに自分の建てた城が一覧で表示される" do
    @group = FactoryBot.create(:programming)
    click_button "＜"
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    click_button "programming"
    find('div.bm-overlay').click
    click_button "城を建てる"
    fill_in "城の名前(目標)", with:"web開発エンジニアになる"
    find(".post-castle-data-button").click

    @group = FactoryBot.create(:study)
    click_button "＜"
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("stu")
    click_button "study"
    find('div.bm-overlay').click
    click_button "城を建てる"
    fill_in "城の名前(目標)", with:"東大合格"
    find(".post-castle-data-button").click

    click_button "＜"
    find(".side-menu-user-icon").click
    find('div.bm-overlay').click
    expect(page).to have_content "web開発エンジニアになる 城"
    expect(page).to have_content "東大合格 城"
  end
end


feature "Show-other-user-castles" , :js => true do
  before do
    visit "/"
    click_button "新規アカウント登録"
    fill_in "user_name", with:"test_user1"
    fill_in "email", with:"hogehoge1@hoge.com"
    fill_in "password", with:"password"
    fill_in "password_confirm", with:"password"
    click_button "登録"
  end

  example "他のユーザーのユーザーページには編集機能に関わるHTML要素を表示しない" do
    @group = FactoryBot.create(:programming)
    click_button "＜"
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    click_button "programming"
    find('div.bm-overlay').click
    click_button "城を建てる"
    fill_in "城の名前(目標)", with:"web開発エンジニアになる"
    find(".post-castle-data-button").click

    click_button "＜"
    find(".side-menu-user-icon").click
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
    click_button "城を建てる"
    fill_in "城の名前(目標)", with:"SQLをマスターする"
    find(".post-castle-data-button").click

    click_button "＜"
    find(".side-menu-user-icon").click
    find('div.bm-overlay').click
    expect(page).to have_content "SQLをマスターする 城"
    expect(page).to have_css '.edit-user-button'
    expect(page).to have_css '.edit-castle-contents-wrapper'
    sleep 1
    click_button "＜"
    click_on "グループを探す"
    find("input[placeholder='グループを探す']").set("progra")
    sleep 2
    click_button "programming"
    find('div.bm-overlay').click
    page.find('.user-name', text: 'test_user1').click
    expect(page).not_to have_css '.edit-user-button'
    expect(page).not_to have_css '.edit-castle-contents-wrapper'
  end
end

require "rails_helper"



feature "Singup" , :js => true do
  example "新規登録後にユーザーページが表示される" do
    visit "/"
    click_button "新規アカウント登録"
    fill_in "user_name", with:"test_user1"
    fill_in "email", with:"hogehoge1@hoge.com"
    fill_in "password", with:"password"
    fill_in "password_confirm", with:"password"
    click_button "登録"
    expect(page).to have_content 'test_user1'
    click_button "・・・"
    click_button "ログアウト"

    visit "/"
    click_button "新規アカウント登録"
    fill_in "user_name", with:"test_user2"
    fill_in "email", with:"hogehoge2@hoge.com"
    fill_in "password", with:"password"
    fill_in "password_confirm", with:"password"
    click_button "登録"
    visit "/"
    expect(page).to have_content 'test_user2'
  end
end


feature "Login-Logout" , :js => true do
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

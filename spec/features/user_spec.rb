require 'rails_helper'

feature "Signup" , :js => true do
  example "新規登録後にユーザーページが表示される" do
    visit "/"
    click_button("新規アカウント登録")
    fill_in 'user_name', with:'test_user'
    fill_in 'email', with:'hogehoge@hoge.com'
    fill_in 'password', with:'password'
    fill_in 'password_confirm', with:'password'
    click_button("登録")
    visit "/"
  end
end

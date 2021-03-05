require 'rails_helper'

RSpec.describe 'User', type: :features do
  feature 'before signup'do
    scenario 'user can signup' do
      visit top_path
      click_on '新規アカウント登録'
      fill_in 'signup-form-name', with: 'rails_tutroial'
      fill_in 'signup-form-email', with: 'rails_tutorial@rails.com'
      fill_in 'signup-form-password', with: 'rails_tutroial'
      fill_in 'signup-form-password-confirmation', with: 'rails_tutroial'
      click_on 'アカウント登録'
      expect(page).to have_content 'アカウントを登録しました'
    end

    scenario 'user cannot login' do
      visit top_path
      click_on 'ログイン'
      fill_in 'login-form-email', with: 'rails_tutorial@rails.com'
      fill_in 'login-form-password', with: 'rails_tutroial'
      click_on 'ログイン'
      expect(page).to have_content 'ログインできませんでした'
    end
  end

  feature 'after signup' do
    background 'signup'do
      @user = create(:rails)
    end

    scenario 'user cannnot signup with duplicate email' do
      visit top_path
      click_on '新規アカウント登録'
      fill_in 'signup-form-name', with: 'rails_tutroial'
      fill_in 'signup-form-email', with: 'rails_tutorial@rails.com'
      fill_in 'signup-form-password', with: 'rails_tutroial'
      fill_in 'signup-form-password-confirmation', with: 'rails_tutroial'
      click_on 'アカウント登録'
      expect(page).to have_content 'アカウント登録できませんでした'
    end

    scenario 'user can login' do
      visit top_path
      click_on 'ログイン'
      fill_in 'login-form-email', with: 'rails_tutorial@rails.com'
      fill_in 'login-form-password', with: 'rails_tutroial'
      click_on 'ログイン'
      expect(page).to have_content 'ログインしました'
    end
  end

end

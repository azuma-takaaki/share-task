FactoryBot.define do
  factory :user do
    name { 'taro' }
    email { Faker::Internet.email }
    password { 'password' }
    password_confirmation { 'password' }
  end

  factory :rails , class: User do
    name { 'rails_tutroial' }
    email { 'rails_tutorial@rails.com' }
    password { 'rails_tutroial' }
    password_confirmation { 'rails_tutroial' }
  end

end

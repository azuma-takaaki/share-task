FactoryBot.define do
  factory :user do
    name { 'taro' }
    email { Faker::Internet.email }
    password { 'password' }
    password_confirmation { 'password' }
    icon {'./icon_1.png'}
  end

  factory :rails , class: User do
    name { 'rails_tutroial' }
    email { 'rails_tutorial@rails.com' }
    password { 'rails_tutroial' }
    password_confirmation { 'rails_tutroial' }
    icon {'./icon_1.png'}
  end

end

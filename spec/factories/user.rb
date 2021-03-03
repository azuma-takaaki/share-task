FactoryBot.define do
  factory :user do
    name { 'taro' }
    email { Faker::Internet.email }
    password { 'password' }
    password_confirmation { 'password' }
  end
end

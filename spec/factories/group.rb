FactoryBot.define do
  factory :group do
    name { 'group_name' }
  end

  factory :other_group , class: Group do
    name { 'other_group' }
  end

  factory :programming , class: Group do
    name { 'programming' }
  end

  factory :study , class: Group do
    name { 'study' }
  end
end

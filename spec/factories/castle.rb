FactoryBot.define do
  factory :castle0, class: Castle do
    name { '積み上げ' }
    castle_part_point {0}
  end

  factory :castle1, class: Castle do
    name { 'programming' }
    castle_part_point {0}
  end
end

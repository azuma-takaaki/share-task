FactoryBot.define do
  factory :castle_part_price0 , class: CastlePartPrice do
    three_d_model_name {"castle.glb"}
    displayed_name  {"城の門"}
    castle_part_point  {1}
    ruby_point  {0}
  end

  factory :castle_part_price1 , class: CastlePartPrice do
    three_d_model_name {"wall_01.glb"}
    displayed_name  {"壁"}
    castle_part_point  {1}
    ruby_point  {0}
  end

end

FactoryBot.define do
  factory :castle_part , class: CastlePart do
    three_d_model_name {"castle.glb"}
    position_x {0}
    position_y {0}
    position_z {0}
    angle_x {0}
    angle_y {0}
    angle_z {0}
  end
end

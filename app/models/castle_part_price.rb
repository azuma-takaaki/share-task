class CastlePartPrice < ApplicationRecord
  validates :three_d_model_name, presence: true
  validates :displayed_name, presence: true
  validates :castle_part_point, presence: true
  validates :ruby_point, presence: true
end

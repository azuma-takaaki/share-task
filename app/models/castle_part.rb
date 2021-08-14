class CastlePart < ApplicationRecord
  validates :castle_id, presence: true
  validates :position_x, presence: true
  validates :position_y, presence: true
  validates :position_z, presence: true
  validates :angle_x, presence: true
  validates :angle_y, presence: true
  validates :angle_z, presence: true
end

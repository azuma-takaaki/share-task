class Report < ApplicationRecord
  belongs_to :user
  belongs_to :castle
  has_many :likes, dependent: :destroy

  validates :content, presence: true
  validates :user_id, presence: true
  validates :castle_id, presence: true
end

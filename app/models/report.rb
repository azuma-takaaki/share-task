class Report < ApplicationRecord
  validates :content, presence: true
  validates :user_id, presence: true
  validates :castle_id, presence: true

end

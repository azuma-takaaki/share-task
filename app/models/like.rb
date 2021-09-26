class Like < ApplicationRecord
  belongs_to :user
  belongs_to :report
  validates :report_id, uniqueness: { scope: [:user_id] }
end

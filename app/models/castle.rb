class Castle < ApplicationRecord
  belongs_to :user
  belongs_to :group

  validates :name, presence: true
end

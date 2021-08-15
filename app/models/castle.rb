class Castle < ApplicationRecord
  belongs_to :user
  belongs_to :group
  has_many :castle_parts, dependent: :destroy

  validates :name, presence: true
end

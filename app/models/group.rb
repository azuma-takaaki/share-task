class Group < ApplicationRecord
  has_many :tasks
  has_many :users, through: :group_users
  has_many :group_users, dependent: :destroy
  validates :name, presence: true
end

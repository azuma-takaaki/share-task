class Group < ApplicationRecord
  has_many :tasks, dependent: :destroy
  has_many :group_users, dependent: :destroy
  has_many :users, through: :group_users
  has_many :castles, dependent: :destroy
  validates :name, presence: true, uniqueness: true
  validates :name, length: { maximum: 20 } 

end

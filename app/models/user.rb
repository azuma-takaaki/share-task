class User < ApplicationRecord
  has_many :group_users, dependent: :destroy
  has_many :groups, through: :group_users
  has_many :castles, dependent: :destroy
  has_many :reports, dependent: :destroy
  has_many :likes, dependent: :destroy

  validates :name, presence: true
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  validates :email, presence: true, length: {maximum: 255},
            format: { with: VALID_EMAIL_REGEX }, uniqueness:true
  validates :password, length: { minimum: 6}, confirmation: true, on: :create
  validates :icon, presence: true
  has_secure_password
end

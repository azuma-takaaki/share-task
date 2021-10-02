class TwitterToken < ApplicationRecord
  belongs_to :user

  validates :token, uniqueness:true
  validates :secret_token, uniqueness:true
  validates :account_name, uniqueness:true

end

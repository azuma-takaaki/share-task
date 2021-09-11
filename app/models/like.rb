class Like < ApplicationRecord
  belongs_to :user, dependent: :destroy
  belongs_to :report, dependent: :destroy
end

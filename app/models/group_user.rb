class GroupUser < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :group, optional: true

  validates :group_id, uniqueness: {scope: :user_id}
end

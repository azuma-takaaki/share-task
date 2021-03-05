class AddIndexGroupUser < ActiveRecord::Migration[6.1]
  def change
    add_index :group_users, [:group_id, :user_id], unique: true
  end
end

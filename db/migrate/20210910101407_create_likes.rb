class CreateLikes < ActiveRecord::Migration[6.1]
  def change
    create_table :likes do |t|
      t.integer :user_id
      t.integer :report_id

      t.timestamps
    end
    add_index :likes, [:user_id, :report_id], unique: true
  end
end

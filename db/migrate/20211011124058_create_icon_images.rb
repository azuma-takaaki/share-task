class CreateIconImages < ActiveRecord::Migration[6.1]
  def change
    create_table :icon_images do |t|
      t.string :image
      t.integer :user_id

      t.timestamps
    end
  end
end

class CreateCastleParts < ActiveRecord::Migration[6.1]
  def change
    create_table :castle_parts do |t|
      t.integer :castle_id
      t.string :model_name
      t.float :position_x
      t.float :position_y
      t.float :position_z
      t.float :angle_x
      t.float :angle_y
      t.float :angle_z

      t.timestamps
    end
  end
end

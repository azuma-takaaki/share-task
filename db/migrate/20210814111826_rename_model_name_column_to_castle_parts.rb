class RenameModelNameColumnToCastleParts < ActiveRecord::Migration[6.1]
  def change
    rename_column :castle_parts, :model_name, :three_d_model_name
  end
end

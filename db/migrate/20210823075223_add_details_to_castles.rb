class AddDetailsToCastles < ActiveRecord::Migration[6.1]
  def change
    add_column :castles, :castle_part_point, :integer
  end
end

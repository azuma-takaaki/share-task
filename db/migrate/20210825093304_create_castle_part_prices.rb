class CreateCastlePartPrices < ActiveRecord::Migration[6.1]
  def change
    create_table :castle_part_prices do |t|
      t.string :three_d_model_name
      t.string :displayed_name
      t.integer :castle_part_point
      t.integer :ruby_point

      t.timestamps
    end
  end
end

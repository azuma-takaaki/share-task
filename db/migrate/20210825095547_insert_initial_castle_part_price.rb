class InsertInitialCastlePartPrice < ActiveRecord::Migration[6.1]
  def change
    prices_list = [{three_d_model_name: "castle.glb", displayed_name: "城の門", castle_part_point: 1, ruby_point: 0},
                   {three_d_model_name: "wall_01.glb", displayed_name: "城の壁", castle_part_point: 1, ruby_point: 0}
                  ]
    prices_list.each do |price|
      CastlePartPrice.create(price)
    end
  end
end

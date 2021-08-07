class AddGroupIdToCastles < ActiveRecord::Migration[6.1]
  def change
    add_reference :castles, :group, foreign_key: true
  end
end

class AddAssociationToReports < ActiveRecord::Migration[6.1]
  def change
    add_column :reports, :user_id, :integer
    add_column :reports, :castle_id, :integer
  end
end

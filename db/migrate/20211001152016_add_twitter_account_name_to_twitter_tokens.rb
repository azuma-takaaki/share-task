class AddTwitterAccountNameToTwitterTokens < ActiveRecord::Migration[6.1]
  def change
    add_column :twitter_tokens, :account_name, :string
  end
end

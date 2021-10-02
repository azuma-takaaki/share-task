class CreateTwitterTokens < ActiveRecord::Migration[6.1]
  def change
    create_table :twitter_tokens do |t|
      t.integer :user_id
      t.string :token
      t.string :secret_token

      t.timestamps
    end
    add_index :twitter_tokens, [:user_id, :token, :secret_token], unique: true
  end
end

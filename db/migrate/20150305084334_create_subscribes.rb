class CreateSubscribes < ActiveRecord::Migration
  def change
    create_table :subscribes do |t|
      t.string :name
      t.string :email, unique: :true
      t.string :confirm_token
      t.boolean :confirmed, default: false
      t.boolean :active, default: false

      t.timestamps
    end
  end
end

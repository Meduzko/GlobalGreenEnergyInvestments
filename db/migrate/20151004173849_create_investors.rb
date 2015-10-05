class CreateInvestors < ActiveRecord::Migration
  def change
    create_table :investors do |t|
      t.belongs_to :user, index: true
      t.belongs_to :project, index: true
      t.integer :participations
      t.float :amount
      t.float :total_amount
      t.boolean :confirm_paid, default: false
      t.datetime :expired_datetime

      t.timestamps null: false
    end
  end
end

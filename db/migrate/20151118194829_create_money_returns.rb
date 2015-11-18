class CreateMoneyReturns < ActiveRecord::Migration
  def change
    create_table :money_returns do |t|
      t.belongs_to :user, index: true
      t.float :amount
      t.date :start_paid
      t.date :end_paid

      t.timestamps null: false
    end
  end
end

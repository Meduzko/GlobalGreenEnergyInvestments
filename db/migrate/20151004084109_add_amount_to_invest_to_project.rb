class AddAmountToInvestToProject < ActiveRecord::Migration
  def change
    add_column :projects, :amount_to_invest, :float, default: 0
  end
end

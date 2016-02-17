class ChangeDefaultValuesForProject < ActiveRecord::Migration
  def change
    change_column :projects, :total_amount_need, :integer, default: 0
    change_column :projects, :total_amount_invested, :integer, default: 0
    change_column :projects, :irr, :float, default: 0
  end
end

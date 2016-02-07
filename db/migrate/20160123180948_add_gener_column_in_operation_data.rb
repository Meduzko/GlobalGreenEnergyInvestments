class AddGenerColumnInOperationData < ActiveRecord::Migration
  def change
    remove_column :projects, :kwh_generated
    remove_column :projects, :launch

    add_column :projects, :kwh_start_date, :date
    add_column :projects, :kwh_already_have,        :integer, default: 0
    add_column :projects, :kwh_generated_per_month, :integer, default: 0
    add_column :projects, :kwh_saved_per_month,     :integer, default: 0
  end
end

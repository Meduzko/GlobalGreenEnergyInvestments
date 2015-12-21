class AddCsvNameToProject < ActiveRecord::Migration
  def change
    add_column :projects, :csv_name, :string
  end
end

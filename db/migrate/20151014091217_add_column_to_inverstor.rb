class AddColumnToInverstor < ActiveRecord::Migration
  def change
    add_column :investors, :check_expired, :boolean, default: false
  end
end

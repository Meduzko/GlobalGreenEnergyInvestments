class ChangeTypeInProject < ActiveRecord::Migration
  def change
    change_column :projects, :created_at, :date
  end
end

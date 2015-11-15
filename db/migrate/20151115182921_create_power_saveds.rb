class CreatePowerSaveds < ActiveRecord::Migration
  def change
    create_table :power_saveds do |t|
      t.belongs_to :project
      t.float :already_saved
      t.float :kwh_at_month
      t.datetime :started_at

      t.timestamps null: false
    end
  end
end

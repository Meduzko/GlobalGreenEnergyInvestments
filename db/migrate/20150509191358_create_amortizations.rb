class CreateAmortizations < ActiveRecord::Migration
  def change
    create_table :amortizations do |t|
      t.belongs_to :project
      t.string :csv_name

      t.timestamps null: false
    end
  end
end

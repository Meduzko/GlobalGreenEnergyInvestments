class CreatePageTabs < ActiveRecord::Migration
  def change
    create_table :page_tabs do |t|
      t.belongs_to :page
      t.string :tab_name
      t.integer :position, default: 1
      t.text :description
      t.boolean :status, default: false

      t.timestamps null: false
    end
  end
end

class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :name
      t.string :title
      t.string :location
      t.string :small_foto
      t.string :big_foto
      t.string :type_of_participation
      t.string :type_of_energe
      t.integer :total_amount_need
      t.integer :total_amount_invested
      t.float :irr
      t.text :desc_1
      t.string :img_1
      t.text :desc_2
      t.string :img_2
      t.text :desc_3
      t.string :img_3
      t.text :desc_4
      t.string :img_4
      t.text :desc_5
      t.string :img_5
      t.boolean :launch
      t.float :kwh_generated
      t.boolean :status

      t.timestamps null: false
    end
  end
end

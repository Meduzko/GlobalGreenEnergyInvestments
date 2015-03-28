class CreateProfiles < ActiveRecord::Migration
  def change
    create_table :profiles do |t|
      t.belongs_to :user
      t.string :phone
      t.date :date_of_birthday
      t.string :country
      t.string :address_street
      t.string :address_num_house
      t.string :address_city
      t.integer :adress_zip_code
      t.string :bank_account_name
      t.string :bank_iban_code

      t.timestamps null: false
    end
  end
end

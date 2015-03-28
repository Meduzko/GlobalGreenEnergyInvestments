ActiveAdmin.register Profile do

  menu priority: 6

  permit_params :user_id, :phone, :date_of_birthday, :country, :address_street, :address_num_house, :address_city, :adress_zip_code, :bank_account_name, :bank_iban_code

  index do
    selectable_column
    id_column
    column :user
    column :phone
    column :date_of_birthday
    column :country
    column :created_at
    column :updated_at
    actions
  end
end

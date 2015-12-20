ActiveAdmin.register User do

  menu priority: 50, label: 'List of inverstors', parent: 'Investors'

  scope :all, :default => true
  scope :with_investment do |users|
    User.with_investment
  end


  index title: 'Investors', :row_class => -> record { 'hightlightuser' if record.investors.count > 0 } do
    selectable_column
    id_column
    column :last_name
    column :first_name
    column :email
    column :invesments do |i|
      if i.investors.count > 0
        scope_full_name = i.full_name.strip.downcase.gsub(" ", "_")
        link_to "#{i.investors.count} - view details", admin_investors_path(scope: scope_full_name)
      else
        "Don't have invesments"
      end
    end
    column :current_sign_in_at
    column :created_at
    actions
  end

  show do
      attributes_table do
        row :last_name
        row :first_name
        row :email
        row :sign_in_count
        row :current_sign_in_at
        row :last_sign_in_at
        row :created_at
        row :updated_at
      end
    panel "Profile" do
      attributes_table_for user.profile do
        row :phone
        row :date_of_birthday
        row :country
        row :address_street
        row :address_num_house
        row :address_city
        row :adress_zip_code
        row :bank_account_name
        row :bank_iban_code
        row :updated_at
      end
    end
  end
end

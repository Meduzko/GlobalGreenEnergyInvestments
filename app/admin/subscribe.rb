ActiveAdmin.register Subscribe do

  permit_params :email, :name, :confirm_token, :confirmed, :active

end

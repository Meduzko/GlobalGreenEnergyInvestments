ActiveAdmin.register Subscribe do

  menu priority: 4

  permit_params :email, :name, :confirm_token, :confirmed, :active

end

ActiveAdmin.register Subscribe do

  menu priority: 4

  permit_params :email, :name, :confirm_token, :confirmed, :active

  action_item only: :index do
    link_to 'Create new letter', admin_subscribesender_path, class: 'action_button'
  end

end

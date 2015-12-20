ActiveAdmin.register Subscribe do

  menu priority: 4, label: 'Subscribers'

  permit_params :email, :name, :confirm_token, :confirmed, :active

  index title: 'Subscribers' do
    selectable_column
    id_column
    column :name
    column :email
    column :confirmed
    column :active
    column :created_at
    column :updated_at
  end

  action_item only: :index do
    link_to 'Create new letter', admin_subscribesender_path, class: 'action_button'
  end

  controller do
    def edit
      @page_title = "Edit Subscriber"
    end
  end

end

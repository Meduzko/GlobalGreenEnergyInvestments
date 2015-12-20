ActiveAdmin.register MoneyReturn do
  before_filter :skip_sidebar!, :only => :index
  #menu priority: 8, label: 'MR'
  menu parent: 'Investors', priority: 60

  permit_params :user_id, :amount, :start_paid, :end_paid

  index do
    selectable_column
    id_column
    column :user
    column :amount
    column :start_paid
    column :end_paid
    actions
  end

end

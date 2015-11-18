ActiveAdmin.register PowerSaved do
  before_filter :skip_sidebar!, :only => :index
  menu priority: 8, label: 'PS'

  permit_params :project_id, :already_saved, :kwh_at_month, :started_at

  index do
    selectable_column
    id_column
    column :project
    column :already_saved
    column :kwh_at_month
    column :started_at
    actions
  end

end

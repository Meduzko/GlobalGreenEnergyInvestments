ActiveAdmin.register PowerSaved do

  menu priority: 8, label: 'PS'

  permit_params :project_id, :already_saved, :kwh_at_month, :started_at

end

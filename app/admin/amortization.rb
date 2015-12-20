ActiveAdmin.register Amortization do
  before_filter :skip_sidebar!, :only => :index
  #menu priority: 9
  menu parent: 'Projects'
  permit_params :project_id, :csv_name


  index do
    selectable_column
    id_column
    column :project
    column "CSV file" do |csv|
      link_to "Download CSV file", "#{request.base_url}#{csv.csv_name}"
    end
    column :created_at
    column :updated_at
    actions
  end


end

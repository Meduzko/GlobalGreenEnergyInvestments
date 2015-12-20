ActiveAdmin.register PageTab do

  before_filter :skip_sidebar!, :only => :index
  menu priority: 99

  permit_params :page_id, :tab_name, :position, :description, :status

  index do
    selectable_column
    id_column
    column :page
    column :tab_name
    column :position
    column :status
    column :created_at
    column :updated_at
    actions
  end

  form do |f|
    f.inputs "page tab info" do
      f.input :page
      f.input :tab_name
      f.input :position
      f.input :description, :as => :ckeditor, :config => { :width => '76%', :height => '400px' }
      f.input :status
    end
    f.actions
  end
end

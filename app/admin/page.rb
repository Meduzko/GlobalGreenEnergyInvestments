ActiveAdmin.register Page do
  before_filter :skip_sidebar!, :only => :index
  menu false
  permit_params :name, :slug, :status, :id

  form do |f|
    f.inputs Page do
      f.input :name
      f.input :status
    end
    f.actions
  end

end

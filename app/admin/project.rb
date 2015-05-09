ActiveAdmin.register Project do

  menu priority: 6

  permit_params :name, :title, :location, :small_foto, :big_foto,
                :remove_small_foto, :remove_big_foto, 
                :type_of_participation, :type_of_energe, :total_amount_need, :total_amount_invested, :irr, 
                :desc_1, :img_1, :desc_2, :img_2, :desc_3, :img_3, :desc_4, :img_4, :desc_5, :img_5, 
                :launch, :kwh_generated, :status

  controller do
    def update
      update! do |format|
        format.html { redirect_to resource_path.concat("/edit") } if resource.valid?
      end
    end

    def create
      create! do |format|
        format.html { redirect_to collection_path } if resource.valid?
      end
    end
  end

  form(:html => { :multipart => true }) do |f|
     f.inputs "Project" do
      f.input :name, :label => 'Project name'
      f.input :title, :label => 'Subtitle'
      f.input :location, :label => 'Location (address)'
      f.input :type_of_participation, :as => :select, :collection => Project::PARTICIPATION
      f.inputs "Small image" do
        f.input :small_foto, :as => :file, :label => '-', :hint => (f.template.image_tag(f.object.small_foto.url(:thumb)) if f.object.small_foto?) 
        f.input :remove_small_foto, as: :boolean, required: :false, label: 'Remove image' if f.object.small_foto?
      end
      f.inputs "Big image" do
        f.input :big_foto, :as => :file, :label => '-', :hint => (f.template.image_tag(f.object.big_foto.url(:thumb)) if f.object.big_foto?) 
        f.input :remove_big_foto, as: :boolean, required: :false, label: 'Remove image' if f.object.big_foto?
      end
      f.input :status
    end
    f.actions
  end
end

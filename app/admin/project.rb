ActiveAdmin.register Project do

  menu priority: 7
  before_filter :skip_sidebar!, :only => :index
  permit_params :name, :title, :location, :small_foto, :big_foto,
                :remove_small_foto, :remove_big_foto,  
                :remove_img_1, :remove_img_2, :remove_img_3, :remove_img_4, :remove_img_5,
                :type_of_participation, :type_of_energe, :total_amount_need, :total_amount_invested, :irr, 
                :desc_1, :img_1, :desc_3, :img_2, :desc_3, :img_3, :desc_4, :img_4, :desc_5, :img_5, 
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

  index do
    selectable_column
    id_column
    column :name
    column :location
    column :launch
    column :status
    column :created_at
    column :updated_at
    actions
  end

  form(:html => { :multipart => true }) do |f|
     f.inputs "Project" do
      f.input :name, :label => 'Project name'
      f.input :title, :label => 'Subtitle'
      f.input :location, :label => 'Location (address)'
      f.inputs "Small image" do
        f.input :small_foto, :as => :file, :label => '', :hint => (image_tag(f.object.small_foto.url(:thumb)) if f.object.small_foto?) 
        f.input :remove_small_foto, as: :boolean, required: :false, label: 'Remove image' if f.object.small_foto?
      end
      f.inputs "Big image" do
        f.input :big_foto, :as => :file, :label => '-', :hint => (image_tag(f.object.big_foto.url(:thumb)) if f.object.big_foto?) 
        f.input :remove_big_foto, as: :boolean, required: :false, label: 'Remove image' if f.object.big_foto?
      end
      f.inputs "Numeric and selection:" do
        f.input :type_of_participation, :as => :select, :collection => Project::PARTICIPATION
        f.input :type_of_energe, :as => :select, :collection => Project::ENERGY
        f.input :total_amount_need, :label => 'Total amount needed'
        f.input :total_amount_invested, :label => 'Total already invested'
        f.input :irr, :label => 'IRR'
      end
      f.inputs "First block" do
        f.input :desc_1, :label => 'Descripton', :as => :ckeditor, :config => { :width => '76%', :height => '400px' }
        f.input :img_1, :as => :file, :label => 'Image for Descripton', :hint => (image_tag(f.object.img_1.url(:project_page)) if f.object.img_1?) 
        f.input :remove_img_1, as: :boolean, required: :false, label: 'Remove image' if f.object.img_1?
      end
      f.inputs "Second block" do
        f.input :desc_2, :label => 'Descripton', :as => :ckeditor, :config => { :width => '76%', :height => '400px' }
        f.input :img_2, :as => :file, :label => 'Image for Descripton', :hint => (image_tag(f.object.img_2.url(:project_page)) if f.object.img_2?) 
        f.input :remove_img_2, as: :boolean, required: :false, label: 'Remove image' if f.object.img_2?
      end
      f.inputs "Third block" do
        f.input :desc_3, :label => 'Descripton', :as => :ckeditor, :config => { :width => '76%', :height => '400px' }
        f.input :img_3, :as => :file, :label => 'Image for Descripton', :hint => (image_tag(f.object.img_3.url(:project_page)) if f.object.img_3?) 
        f.input :remove_img_3, as: :boolean, required: :false, label: 'Remove image' if f.object.img_3?
      end
      f.inputs "Fourth block" do
        f.input :desc_4, :label => 'Descripton', :as => :ckeditor, :config => { :width => '76%', :height => '400px' }
        f.input :img_4, :as => :file, :label => 'Image for Descripton', :hint => (image_tag(f.object.img_4.url(:project_page)) if f.object.img_4?) 
        f.input :remove_img_4, as: :boolean, required: :false, label: 'Remove image' if f.object.img_4?
      end
      f.inputs "Fifth block" do
        f.input :desc_5, :label => 'Descripton', :as => :ckeditor, :config => { :width => '76%', :height => '400px' }
        f.input :img_5, :as => :file, :label => 'Image for Descripton', :hint => (image_tag(f.object.img_5.url(:project_page)) if f.object.img_5?) 
        f.input :remove_img_5, as: :boolean, required: :false, label: 'Remove image' if f.object.img_5?
      end
      f.inputs "Project start" do
        f.input :launch, :label => 'Click here if you want to display kwh generated'
        f.input :kwh_generated
      end
      f.inputs "Status" do
        f.input :status, :label => 'Dispaly on site'
      end
    end
    f.actions
  end
end
ActiveAdmin.register Project do

  menu priority: 1
  before_filter :skip_sidebar!, :only => :index
  permit_params :name, :title, :location, :small_foto, :big_foto,
                :remove_small_foto, :remove_big_foto,
                :remove_img_1, :remove_img_2, :remove_img_3, :remove_img_4, :remove_img_5,
                :type_of_participation, :type_of_energe, :total_amount_need, :total_amount_invested, :irr,
                :desc_1, :img_1, :desc_2, :img_2, :desc_3, :img_3, :desc_4, :img_4, :desc_5, :img_5,
                :launch, :kwh_generated, :status, :created_at, :pdf, :remove_pdf, :number_of_participations, :csv_name, :remove_csv_name,
                :payments_start_date, :payments_duration_months, :money_return_per_month,
                :kwh_start_date, :kwh_already_have, :kwh_generated_per_month, :kwh_saved_per_month

  actions :all, except: [:destroy]

  member_action :sent_event, method: :get do
    project = Project.find_by(id: params[:id])
    if project && project.status
      Subscribe.confirmed.active.each do |user|
        SubscribeMailer.new_project(project, user).deliver_later
      end
      project.update(sent_subscription: project.sent_subscription + 1)
      redirect_to admin_projects_path, notice: "Success! Emails about project #{project.name} were sent."
    else
      redirect_to admin_projects_path, alert: "Error. Project not active on site or Couldn't find the project."
    end
  end

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
    column :name
    column :invested
    column :total_amount_need
    column '# of Investors' do |i|
      link_to i.investors.confirm.count, admin_investors_path(scope: i.name.parameterize("_"))
    end
    column :launch do |p|
      status = p.launch? ? 'yes' : 'no'
      content_tag(:span, status, class: "status_tag #{status} ")
    end
    column 'Display on site' do |p|
      status = p.status ? 'yes' : 'no'
      content_tag(:span, status, class: "status_tag #{status} ")
    end
    column :created_at
    column 'Email project info' do |s|
      if s.sent_subscription > 0
        link_to "Already sent #{s.sent_subscription} times, repeat?", sent_event_admin_project_path(s.id), data: { :confirm => "Are you sure? You already sent emails." }
      else
        link_to 'Send the emails', sent_event_admin_project_path(s.id), data: { :confirm => "Are you sure? Need active status" }
      end
    end
    actions
  end

  form(:html => { :multipart => true }) do |f|
     f.inputs "Project" do
      f.input :name, :label => 'Project name'
      f.input :title, :label => 'Subtitle'
      f.input :location, :label => 'Location (address)'
      f.input :type_of_energe, :as => :select, :collection => Project::ENERGY, label: 'Type of energy'
      f.input :created_at
      f.inputs "Investment information" do
        f.input :type_of_participation, :as => :select, :collection => Project::PARTICIPATION
        f.input :total_amount_need,     label: 'Total amount needed'
        f.input :total_amount_invested, label: 'Total already invested'
        f.input :number_of_participations
        f.input :payments_start_date
        f.input :payments_duration_months
        f.input :amount_to_invest, input_html: { disabled: true }, label: 'Min. investment'
        f.input :irr, :label => 'IRR'
        f.input :money_return_per_month, :label => 'Total money return per month', hint: 'per participations'
      end
      f.inputs 'Operating data' do
        f.input :kwh_start_date, label: 'Operation Start Date (Generation or Saving)'
        f.input :kwh_already_have, label: 'KWH already accumulated (Generation or Saving)'
        f.input :kwh_generated_per_month#, #hint: 'genarating per month'
        f.span ' OR'
        f.input :kwh_saved_per_month#,     #hint: 'saving per month'
      end
      f.inputs "Upload Amortization Table" do
        f.input :csv_name, :label => 'Only CSV:', :hint => (link_to 'Download csv', f.object.csv_name.url if f.object.csv_name?)
        f.input :remove_csv_name, as: :boolean, required: :false, label: 'Remove csv fi;e' if f.object.csv_name?
      end
      f.inputs "Upload Memorandum PDF" do
        f.input :pdf, :label => 'Only pdf:', :hint => (link_to 'Download pdf', f.object.pdf.url if f.object.pdf?)
        f.input :remove_pdf, as: :boolean, required: :false, label: 'Remove pdf' if f.object.pdf?
      end
      f.inputs "Status", class: 'hightlightinputs' do
        f.input :status, :label => 'Dispaly on site'
      end

      f.inputs "Small image" do
        f.input :small_foto, :as => :file, :label => '', :hint => (image_tag(f.object.small_foto.url(:thumb)) if f.object.small_foto?)
        f.input :remove_small_foto, as: :boolean, required: :false, label: 'Remove image' if f.object.small_foto?
      end
      f.inputs "Big image" do
        f.input :big_foto, :as => :file, :label => 'Recommended: 1500x730px.', :hint => (image_tag(f.object.big_foto.url(:thumb)) if f.object.big_foto?)
        f.input :remove_big_foto, as: :boolean, required: :false, label: 'Remove image' if f.object.big_foto?
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
    end
    f.actions
  end

  show do
    render partial: 'show', locals: {project: project }
    # h2 project.name
    # panel "Project Details" do
    #   #Project.last.investors.joins(:user).confirm.group('users.id').sum(:total_amount)
    #   attributes_table_for project do
    #     # row("Status") { status_tag (task.is_done ? "Done" : "Pending"), (task.is_done ? :ok : :error) }
    #     hash = project.investors.joins(:user).confirm.group('users.id').sum(:total_amount)
    #     hash.keys.each do |user|
    #       row(User.find(user).try(:full_name)) { hash[user].round(2) }
    #     end
    #     row("Total amount invested") { hash.values.inject(:+).round(2) }
    #
    #     # row("Assigned To") { link_to task.admin_user.email, admin_admin_user_path(task.admin_user) }
    #     # row("Due Date") { task.due_date? ? l(task.due_date, :format => :long) : '-' }
    #   end
    # end
  end
end

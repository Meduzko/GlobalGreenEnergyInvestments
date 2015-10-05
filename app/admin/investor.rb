ActiveAdmin.register Investor do
  config.batch_actions = false
  before_filter :skip_sidebar!, :only => :index
  menu priority: 9

  permit_params :user_id, :project_id, :participations, :amount, :total_amount, :confirm_paid, 
                :expired_datetime, :created_at, :updated_at

  scope :all, :default => true
  scope :confirm do |investors|
    investors.where(confirm_paid: true)
  end
  scope :expired do |investors|
    investors.where('expired_datetime < ?', Time.now)
  end  
  scope :unconfirm do |investors|
    investors.where(confirm_paid: false)
  end

  controller do
    before_filter :update_scopes, :only => :index

    def update_scopes
      resource = active_admin_config

      Project.order(created_at: :desc).each do |project|
        next if resource.scopes.any? { |scope| scope.name == project.name }
        resource.scopes << (ActiveAdmin::Scope.new project.name do |projects|
          project.investors
        end)
      end

    end
  end

  index do
    column :project
    column :user
    column :total_amount do |i|
      link_to i.total_amount, admin_investor_path(i.id), title: 'Details'
    end
    column :confirm_paid
    column :expired_datetime
    column :created_at
    column :updated_at
    actions
  end
end

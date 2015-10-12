ActiveAdmin.register Investor do
  config.batch_actions = false
  before_filter :skip_sidebar!, :only => :index
  menu priority: 9

  permit_params :user_id, :project_id, :participations, :amount, :total_amount, :confirm_paid, 
                :expired_datetime, :created_at, :updated_at

  scope :all, :default => true
  scope :confirm do |investors|
    Investor.confirm
  end
  scope :expired do |investors|
    Investor.expired
  end  
  scope :unconfirm do |investors|
    Investor.unconfirm
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
    column :expired_datetime do |i|
      if i.is_expired?
        status_tag('Expired')
      elsif i.is_paid?
        status_tag('Paid')
      else
        i.expired_datetime
      end
    end
    column :created_at
    column :updated_at
    actions
  end
end

ActiveAdmin.register Investor do
  config.batch_actions = false
  before_filter :skip_sidebar!, :only => :index
  #menu priority: 8
  menu parent: 'Investors', label: 'All invesments', priority: 55

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
    before_filter :add_user_scope, :only => :index

    def update_scopes
      resource = active_admin_config

      Project.order(created_at: :desc).each do |project|
        next if resource.scopes.any? { |scope| scope.name == project.name }
        resource.scopes << (ActiveAdmin::Scope.new project.name do |projects|
          project.investors
        end) if project.investors.count > 0
      end
    end

    def add_user_scope
      resource = active_admin_config
      User.all.each do |u|
        next if resource.scopes.any? { |scope| scope.name == u.full_name }
        resource.scopes << (ActiveAdmin::Scope.new u.full_name do |projects|
          u.investors
        end) if u.investors.count > 0
      end
    end

    def destroy
      investor = Investor.find(params[:id])
      if investor
        changed_total_amount_invested = investor.project.total_amount_invested - investor.total_amount
        investor.project.update(total_amount_invested: changed_total_amount_invested)
      end
      super
    end
  end

  form do |f|
    inputs 'Investor Paid Info' do
      input :user, :input_html => { :disabled => true }
      input :project, :input_html => { :disabled => true }
      input :total_amount, :input_html => { :disabled => true }
      input :confirm_paid
      actions
    end
  end

  index title: 'All investments' do
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

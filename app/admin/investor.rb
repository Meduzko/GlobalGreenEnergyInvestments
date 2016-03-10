ActiveAdmin.register Investor do
  #menu :if => proc{false}

  config.batch_actions = false
  config.clear_action_items!

  before_filter :skip_sidebar!, :only => :index
  #menu priority: 0
  menu label: 'List of investors', priority: 40

  permit_params :user_id, :project_id, :participations, :amount, :total_amount, :confirm_paid,
                :created_at, :updated_at

  scope :all, :default => true
  scope :confirm do |investors|
    Investor.confirm
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

    def update
      super
      investor = Investor.find(params[:id])
      InvestorMailer.confirm_paid(investor).deliver if investor.confirm_paid == true
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
    column '# of participations' do |i|
      i.participations
    end
    column :total_amount do |i|
      link_to i.total_amount, admin_investor_path(i.id), title: 'Details'
    end
    column :confirm_paid
    column :created_at
    actions
  end
end

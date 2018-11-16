Rails.application.routes.draw do
  get 'idea'     => 'pages#idea', :as => :page_idea
  get 'invest'   => 'pages#invest', :as => :page_invest
  get 'about'    => 'pages#about', :as => :page_about
  get 'legal'    => 'pages#legal', :as => :page_legal
  get 'contact'  => 'pages#contact', :as => :page_contact
  post 'contact' => 'pages#send_contact'

  match '/curl' => 'projects#total_kwh', via: :get

  mount Ckeditor::Engine => '/ckeditor'
  devise_for :users, :controllers => { registrations: 'registrations', sessions: 'sessions', passwords: 'passwords',  confirmations: 'confirmations' }
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  resources 'projects', only: [:index, :show] do
    post :confirm_participation
    member do
      get :avaible_participation
    end
  end

  get  'get_pdf/:file_name' => 'investor#show', :as => :pdf_file

  resources 'subscribes', only: [:create] do
    member do
      get :confirmation
      get :unsubscribe
    end
  end

  get  'profile' => 'profiles#edit', :as => :profile
  post 'profile' => 'profiles#create_or_update', :as => :profile_ctr_or_upd
  root 'home#index'
  #get ':slug' => 'pages#show',  :as => :pages
  require 'sidekiq/web'
  mount Sidekiq::Web => '/sidekiq'
end

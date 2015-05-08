Rails.application.routes.draw do
  get 'idea' => 'pages#idea', :as => :page_idea
  get 'invest' => 'pages#invest', :as => :page_invest
  get 'about' => 'pages#about', :as => :page_about
  get 'contact' => 'pages#contact', :as => :page_contact
  get 'legal' => 'pages#legal', :as => :page_legal

  mount Ckeditor::Engine => '/ckeditor'
  devise_for :users, :controllers => { registrations: 'registrations', sessions: 'sessions', passwords: 'passwords' }
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  root 'home#index'
  resources 'subscribes', only: [:create] do
    member do
      get :confirmation
    end
  end
  get 'profile' => 'profiles#edit', :as => :profile
  post 'profile' => 'profiles#create_or_update', :as => :profile_ctr_or_upd
  #get ':slug' => 'pages#show',  :as => :pages
  #resources 'profiles', only: [:create, :edit, :update]
end

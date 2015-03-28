Rails.application.routes.draw do
  mount Ckeditor::Engine => '/ckeditor'
  devise_for :users, :controllers => { registrations: 'registrations' }
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  root 'home#index'
  resources 'subscribes', only: [:create] do
    member do
      get :confirmation
    end
  end
  get ':slug' => 'pages#show',  :as => :pages
end

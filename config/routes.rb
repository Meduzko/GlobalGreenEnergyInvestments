Rails.application.routes.draw do
  root 'home#index'
  resources 'subscribes', only: [:create] do
    member do
      get :confirmation
    end
  end
end

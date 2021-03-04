Rails.application.routes.draw do

  get 'group_user/new'
  root to: 'static_pages#top', as: 'top'
  get 'sessions/login', to: 'sessions#login_page', as: 'login_page'
  post 'sessions/login', to: 'sessions#login', as: 'login'
  get 'users/logout', to: 'users#logout', as: 'logout'

  resources :users
  resources :tasks
  resources :groups
  resources :group_user

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end

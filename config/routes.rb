Rails.application.routes.draw do

  get 'castles/create'
  get 'render_random_number', to: 'users#random_number', as: 'random_number'
  namespace :api, format: 'json' do
    namespace :v1  do
      get 'hello/name', to:'hello#name'
      resources :hello
    end
  end
  get 'group_user/new'
  root to: 'static_pages#top', as: 'top'
  get 'sessions/login', to: 'sessions#login_page', as: 'login_page'
  post 'sessions/login', to: 'sessions#login', as: 'login'
  get 'users/logout', to: 'users#logout', as: 'logout'
  get '/get_group_list', to: 'users#get_group_list'
  get 'all_user', to: 'users#all_user'
  get 'react_test', to: 'users#react_test'
  delete 'group_user', to: 'group_user#destroy'
  get 'get_castle_list/:group_id', to: 'castles#get_castle_list'

  resources :users
  resources :tasks
  resources :groups
  resources :group_user
  resources :castles

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end

Rails.application.routes.draw do

  get 'tweets/create'
  get 'likes/create'
  get 'likes/destroy'
  get 'castle_part_price/index'
  get 'reports/create'
  get 'castle_parts/create'
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
  get 'get_group_castle_list/:group_id', to: 'castles#get_group_castle_list'
  get 'get_user_castle_list/:user_id', to: 'castles#get_user_castle_list'
  get 'get_castle_part_price_list', to: 'castle_part_price#index'
  get 'get_popular_groups', to: 'groups#get_popular_groups'
  get '/auth/twitter/callback', to: 'tweets#callback'


  resources :users
  resources :tasks
  resources :groups
  resources :group_user
  resources :castles
  resources :castle_parts
  resources :reports
  resources :likes
  resources :tweets
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end

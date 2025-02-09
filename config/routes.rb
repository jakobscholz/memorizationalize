Rails.application.routes.draw do
  devise_for :users, skip: :all
  root to: 'home#show'

  resource :home, only: :show

  resources :notes, only: [:create, :update, :show, :destroy]
  resources :todos, only: [:create, :update, :show]
  resources :ideas, only: [:create, :update, :show]
  resources :images, only: [:create, :update, :show]
  resources :events, only: [:create, :update, :new, :edit, :show]
  resources :categories, only: [:index, :create, :update]

  # resources :categories, only: [:index, :create, :update]

  resources :galleries, only: [] do
    post :show_all
  end

  resources :users do
    collection do
      resources :sessions, only: [:new, :create], controller: 'users/sessions' do
        collection do
          delete :destroy
        end
      end
    end
    resources :category_mappings, only: :update, controller: 'users/category_mappings'
  end
end

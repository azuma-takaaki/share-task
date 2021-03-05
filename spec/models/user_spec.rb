require 'rails_helper'

RSpec.describe User , type: :model do
  describe 'unit test of User model' do
      before(:each) do
        @user = FactoryBot.build(:user) #DB登録
      end


      it 'is valid, when all data is valid' do
        expect(@user).to be_valid
      end

      it 'is invalid, when name is blank' do
        @user.name = ''
        expect(@user).not_to be_valid
      end

      it 'is invalid, when email is invalid' do
        @user.email = 'aaa@aaa'
        expect(@user).not_to be_valid
      end

      it 'is invalid, when password is too short' do
        @user.password = @user.password_confirmation = 'short'
        expect(@user).not_to be_valid
      end
  end
end

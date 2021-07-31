require 'rails_helper'

RSpec.describe "User", type: :model do
  describe "#create" do
    before do
      @user = FactoryBot.build(:user)
    end

    example "正しい情報は登録ができる" do
      expect(@user.valid?).to eq true
    end

    example "名前が空だと登録できない" do
      @user.name = nil
      @user.valid?
      expect(@user.errors.full_messages).to include("Name can't be blank")
    end

    example "emailが空だと登録できない" do
      @user.email = nil
      @user.valid?
      expect(@user.errors.full_messages).to include("Email can't be blank")
    end

    example "passwordが空だと登録できない" do
      @user.password = nil
      @user.valid?
      expect(@user.errors.full_messages).to include("Password can't be blank")
    end

    example "iconが空だと登録できない" do
      @user.icon = nil
      @user.valid?
      expect(@user.errors.full_messages).to include("Icon can't be blank")
    end


    example "emailが256文字以上だと登録できない" do
      @user.email = "a" * 250+ "@a.com"
      @user.valid?
      expect(@user.errors.full_messages).to include("Email is too long (maximum is 255 characters)")
     end

     example "passwordが6文字未満だと登録できない" do
       @user.password = "a" * 5
       @user.password_confirmation = "a" * 5
       @user.valid?
       expect(@user.errors.full_messages).to include("Password is too short (minimum is 6 characters)")
     end
  end
end

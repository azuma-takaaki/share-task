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
      expect(@user.errors.full_messages).to include("名前を入力してください")
    end

    example "emailが空だと登録できない" do
      @user.email = nil
      @user.valid?
      expect(@user.errors.full_messages).to include("メールアドレスを入力してください")
    end

    example "passwordが空だと登録できない" do
      @user.password = nil
      @user.valid?
      expect(@user.errors.full_messages).to include("パスワードを入力してください")
    end

    example "iconが空だと登録できない" do
      @user.icon = nil
      @user.valid?
      expect(@user.errors.full_messages).to include("Iconを入力してください")
    end


    example "emailが256文字以上だと登録できない" do
      @user.email = "a" * 250+ "@a.com"
      @user.valid?
      expect(@user.errors.full_messages).to include("メールアドレスは255文字以内で入力してください")
     end

     example "passwordが6文字未満だと登録できない" do
       @user.password = "a" * 5
       @user.password_confirmation = "a" * 5
       @user.valid?
       expect(@user.errors.full_messages).to include("パスワードは6文字以上で入力してください")
     end
  end
end

require 'rails_helper'


RSpec.describe "Castle", type: :model do
  describe "#create" do
    before do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      @castle = FactoryBot.build(:castle, user: @user, group: @group)
    end

    example "正しい情報は登録ができる" do
      expect(@castle.valid?).to eq true
    end

    example "名前が空だと登録できない" do
      @castle.name = nil
      @castle.valid?
      expect(@castle.errors.full_messages).to include("城の名前を入力してください")
    end

    example "ユーザーが空だと登録できない" do
      @castle.user = nil
      @castle.valid?
      expect(@castle.errors.full_messages).to include("Userを入力してください")
    end

    example "グループが空だと登録できない" do
      @castle.group = nil
      @castle.valid?
      expect(@castle.errors.full_messages).to include("Groupを入力してください")
    end
  end
end

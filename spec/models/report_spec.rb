require 'rails_helper'

RSpec.describe Report, type: :model do
  describe "#create" do
    before do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      @castle = FactoryBot.create(:castle0, user: @user, group: @group)
    end

    describe "#valid_infomation" do
      example "正しい情報で登録ができる" do
        @report = FactoryBot.build(:report, user_id: @user.id, castle_id: @castle.id)
        expect(@report.valid?).to eq true
      end
    end

    describe "#invalid_infomation" do
      example "contentカラムが空だと登録できない" do
        @report = FactoryBot.build(:report, user_id: @user.id, castle_id: @castle.id)
        @report.content = ""
        expect(@report.valid?).to eq false
      end

      example "user_idカラムが空だと登録できない" do
        @report = FactoryBot.build(:report, user_id: nil, castle_id: @castle.id)
        expect(@report.valid?).to eq false
      end

      example "castle_idカラムが空だと登録できない" do
        @report = FactoryBot.build(:report, user_id: @user.id, castle_id: nil)
        expect(@report.valid?).to eq false
      end
    end

  end
end

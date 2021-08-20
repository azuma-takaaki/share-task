require 'rails_helper'

RSpec.describe CastlePart, type: :model do
  describe "#create" do
    before do
      @user = FactoryBot.create(:user)
      @group = FactoryBot.create(:group)
      @castle = FactoryBot.create(:castle0, user: @user, group: @group)
    end

    describe "#valid_infomation" do
      example "正しい情報で登録ができる" do
        @castle_part = FactoryBot.build(:castle_part)
        @castle_part.castle_id = @castle.id
        expect(@castle_part.valid?).to eq true
      end
    end

    describe "#invalid_infomation" do
      example "castle_idが空だと登録できない" do
        @castle_part = FactoryBot.build(:castle_part)
        @castle_part.castle_id = nil
        expect(@castle_part.valid?).to eq false
      end

      example "positionが空だと登録できない" do
        @castle_part = FactoryBot.build(:castle_part)
        @castle_part.position_x = nil
        expect(@castle_part.valid?).to eq false
      end

      example "angleが空だと登録できない" do
        @castle_part = FactoryBot.build(:castle_part)
        @castle_part.angle_x = nil
        expect(@castle_part.valid?).to eq false
      end
    end
  end
end

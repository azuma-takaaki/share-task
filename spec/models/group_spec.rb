require 'rails_helper'

RSpec.describe Group, type: :model do
  describe "#create" do
    before do
      @group = FactoryBot.build(:group)
    end

    describe "#valid_infomation" do
      example "正しい情報で登録ができる" do
        expect(@group.valid?).to eq true
      end
    end

    describe "#invalid_infomation" do
      example "名前が空だと登録できない" do
        @group.name = ''
        expect(@group.valid?).to eq false
      end

      example "同じ名前のグループは作成できない" do
        @group.save
        expect(@group.valid?).to eq true
        @other_group = FactoryBot.build(:other_group)
        @other_group.name = @group.name
        @other_group.valid?
        expect(@other_group.errors.full_messages).to include "Nameはすでに存在します"
      end
    end
  end
end

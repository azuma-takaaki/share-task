require 'rails_helper'

RSpec.describe GroupUser, type: :model do
  before do
    @user = create(:user)
    @group = create(:group)
    @group_user = create(:group_user, group_id: @group.id, user_id: @user.id)
  end
  example 'dublicate table is invalid' do
    @dup_group_user = @group_user.dup
    expect(@dup_group_user).not_to be_valid
  end

end

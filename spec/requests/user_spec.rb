require 'rails_helper'

RSpec.describe ReportsController, type: :request do
  before do
    @user = FactoryBot.create(:user)
    @group = FactoryBot.create(:group)
  end
end

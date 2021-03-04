require "test_helper"

class GroupUserControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get group_user_new_url
    assert_response :success
  end
end

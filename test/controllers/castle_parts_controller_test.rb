require "test_helper"

class CastlePartsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get castle_parts_create_url
    assert_response :success
  end
end

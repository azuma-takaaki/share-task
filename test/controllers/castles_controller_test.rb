require "test_helper"

class CastlesControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get castles_create_url
    assert_response :success
  end
end

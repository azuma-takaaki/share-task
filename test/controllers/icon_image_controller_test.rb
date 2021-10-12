require "test_helper"

class IconImageControllerTest < ActionDispatch::IntegrationTest
  test "should get upload" do
    get icon_image_upload_url
    assert_response :success
  end
end

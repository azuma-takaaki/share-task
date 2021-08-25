require "test_helper"

class CastlePartPriceControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get castle_part_price_index_url
    assert_response :success
  end
end

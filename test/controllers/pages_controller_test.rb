require 'test_helper'

class PagesControllerTest < ActionController::TestCase
  test "should get idea" do
    get :idea
    assert_response :success
  end

  test "should get invest" do
    get :invest
    assert_response :success
  end

  test "should get about" do
    get :about
    assert_response :success
  end

  test "should get contact" do
    get :contact
    assert_response :success
  end

end

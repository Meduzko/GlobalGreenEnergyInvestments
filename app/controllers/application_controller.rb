class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  layout :layout_by_resource

  protected

  def layout_by_resource
    if devise_controller?
      "authentication"
    else
      "application"
    end
  end

  def after_sign_in_path_for(resource)
    case resource
      when User
        profile_path + "#profile_settings"
      when AdminUser
        admin_dashboard_path
      end
  end
end

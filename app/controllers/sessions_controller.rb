class SessionsController < Devise::SessionsController
  clear_respond_to
  respond_to :json

  def create
    @resource = warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
    render :status => 200,
           :json => { :status => 'success',
                      :user => current_user,
                      :success => 'You are successfully logged in.',
                      :redirect_to => request.base_url + "/profile"}
  end

   def failure
    return render :json => {:status => 'errors', :errors => alert}
  end
end

# hook to redirect to needed admin zone (conflict with custom devise)
class ActiveAdmin::Devise::SessionsController
  def after_sign_in_path_for(resource)
    admin_dashboard_path
  end
end

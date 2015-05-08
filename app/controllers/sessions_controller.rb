class SessionsController < Devise::SessionsController
  clear_respond_to
  respond_to :json

  def create
    @resource = warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
    render :status => 200,
           :json => { :status => 'success',
                      :user => current_user,
                      :redirect_to => request.base_url + "/profile#profile_settings"}
  end

   def failure
    return render :json => {:status => 'errors', :errors => alert}
  end
end

class PasswordsController < Devise::PasswordsController
  respond_to :json

  def create
    @user = User.send_reset_password_instructions(params[:user])
    if successfully_sent?(@user)
      render :status => 200,
             :json => { :status => 'success', :success => 'OK' }
    else
      render :status => 422, :json => {:status => 'errors', :errors => @user.errors.full_messages}
    end
  end

  def edit
    super
  end

end

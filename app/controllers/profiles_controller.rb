class ProfilesController < ApplicationController
  before_filter :authenticate_user!
  
  def edit
    @profile = current_user.profile
  end

  def create_or_update
    profile = current_user.profile
    Profile.create!(profile_params) if profile.nil?
    profile.update(profile_params) if profile.present?
    current_user.update(user_params)
    redirect_to action: :edit
  end

  private
    def user_params
      params.require(:user).permit(:first_name, :last_name, :email)
    end

    def profile_params
      params.require(:profile).permit(:user_id, :phone, :date_of_birthday, :country, :address_street, :address_num_house, :address_city, :adress_zip_code, :bank_account_name, :bank_iban_code)
    end

end

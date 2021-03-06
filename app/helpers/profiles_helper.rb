module ProfilesHelper

  def short_user_info
    if current_user && current_user.profile
      user_info = ''
      user_info += current_user.profile.date_of_birthday.to_s(:normal) + ', ' if current_user.profile.date_of_birthday.present?
      user_info += current_user.profile.country_name + ', ' if current_user.profile.country_name.present?
      user_info += current_user.profile.address_city if current_user.profile.address_city.present?
      user_info
    end
  end
end

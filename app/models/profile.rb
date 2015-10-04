class Profile < ActiveRecord::Base
  belongs_to :user

  def country_name
    ISO3166::Country[self.country].name if self.country.present?
  end
end

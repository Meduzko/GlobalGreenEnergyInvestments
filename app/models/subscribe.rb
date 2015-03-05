class Subscribe < ActiveRecord::Base
	validates :name, presence: true
	validates :email, presence: true, uniqueness: true, email_format: { message: I18n.t(:sbsr_email_format) }

  before_validation :downcase_email

  private
    def downcase_email
      self.email = self.email.downcase if self.email.present?
    end
end

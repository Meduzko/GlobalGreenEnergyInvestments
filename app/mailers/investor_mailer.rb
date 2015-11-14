class InvestorMailer < ApplicationMailer
  def new_investor(user, pdf_path = nil)
    @user = user
    attachments['ggie.pdf'] = File.read(pdf_path) unless pdf_path.nil?
    mail(to: @user.email, subject: 'Thank you for becoming an investor.')
  end
end

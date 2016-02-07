class InvestorMailer < ApplicationMailer
  def new_investor(user, pdf_path = nil)
    @user = user
    attachments['ggie.pdf'] = File.read(pdf_path) unless pdf_path.nil?
    mail(to: @user.email, subject: 'Thank you for becoming an investor.')
  end

  def new_investor_copy(investor)
    @investor = investor
    mail('investors@globalgreenenergyinvestments.com', subject: 'Investment confirmation')
  end

  def confirm_paid(investor)
    @investor = investor
    mail(to: investor.user.email, subject: 'Payment Confirmation Global Green Energy Investments')
  end
end

class InvestorMailer < ApplicationMailer
  def new_subscription(user)
    @user = user
    mail(to: @user.email, subject: 'Thank you for becoming an investor.')
  end
end

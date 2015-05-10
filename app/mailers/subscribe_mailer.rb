class SubscribeMailer < ApplicationMailer

  def new_subscription(user)
    @user = user
    @url  = "http://globalgreeninvestmentgroup.com/subscribes/#{@user.confirm_token}/confirmation"
    mail(to: @user.email, subject: 'GGIG Subscription. Confirm your email.')
  end

  def new_project(project, user)
    @user = user
    @url = "http://globalgreeninvestmentgroup.com/projects/#{project.id}"
    mail(to: @user.email, subject: "GGIG Subscription. Present the new Project #{project.name}" )
  end
end

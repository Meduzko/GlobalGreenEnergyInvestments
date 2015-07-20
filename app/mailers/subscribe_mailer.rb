class SubscribeMailer < ApplicationMailer
  #before_action :unsubscribe, only: [:new_project, :sent_email]
  def new_subscription(user)
    @user = user
    @url  = "http://globalgreeninvestmentgroup.com/subscribes/#{@user.confirm_token}/confirmation"
    mail(to: @user.email, subject: 'GGEI Subscription. Confirm your email.')
  end

  def new_project(project, user)
    @user = user
    @url = "http://globalgreeninvestmentgroup.com/projects/#{project.id}"
    unsubscribe(user)
    mail(to: @user.email, subject: "GGEI Subscription. Present the new Project #{project.name}" )
  end

  # contact form
  def contact_form(form)
      @form = form
      mail(to: 'ggigsite@gmail.com', subject: "GGEI site: contact form")
  end

  # for emails subsribe
  def sent_email(user, subject, body)
      @body = body
      unsubscribe(user)
      mail(to: user.email, subject: subject)
  end

  private
    def unsubscribe(user)
      @unsubscribe = true
      @unsubscribe_url =  "http://globalgreeninvestmentgroup.com/subscribes/#{user.confirm_token}/unsubscribe"
    end


end

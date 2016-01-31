ActiveAdmin.register_page "SubscribeSender" do

  menu false

  action_item :subscibers_back_btn do
    link_to 'Back to subscibers', admin_subscribes_path
  end

  page_action :sent_email, method: :post do
    subject = params[:subject]
    body    = params[:body]
    unless subject.empty? || body.empty?
      Subscribe.confirmed.active.each do |user|
          SubscribeMailer.sent_email(user, subject, body).deliver_later
      end
      redirect_to admin_subscribes_path, notice: "Success. Emails were send."
    else
      redirect_to admin_subscribesender_path, alert: "Error. Subject and body cannot be empty!"
    end
  end

  content do
    render partial: 'subscribe_sender'
  end

end

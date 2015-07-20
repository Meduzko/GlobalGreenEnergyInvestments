class SubscribesController < ApplicationController
  include SubscribesHelper
  
  def create
    subscribe = Subscribe.new(subscribe_params)
    subscribe.confirm_token = generate_token
    if subscribe.save
      SubscribeMailer.new_subscription(subscribe).deliver_later
      json = { status: 'success', messages: I18n.t(:sbsr_message_success) }
    else
      json = { status: 'error', messages: subscribe.errors.full_messages }
    end
    respond_to do |format|
      format.json { render json: json }
    end
  end

  def confirmation
    subscribe = Subscribe.find_by_confirm_token(params[:id])
    if subscribe && subscribe.confirmed == false && subscribe.active == false
      subscribe.update_attributes(confirmed: true, active: true)
      @status = I18n.t(:sbsr_confirm_good)
    else
      @status = I18n.t(:sbsr_confirm_bad)
    end
  end

  def unsubscribe
    subscribe = Subscribe.find_by_confirm_token(params[:id])
    if subscribe && subscribe.confirmed == true && subscribe.active == true
      subscribe.update_attributes(confirmed: true, active: false)
      @status = I18n.t(:sbsr_unsubscribe_good)
    else
      @status = I18n.t(:sbsr_confirm_bad)
    end
  end

  private
    def subscribe_params
      params.require(:subscribe).permit(:name, :email)
    end
end

class SubscribesController < ApplicationController
  def create
    subscribe = Subscribe.new(subscribe_params)
    if subscribe.save
      json = { status: 'success', messages: I18n.t(:sbsr_message_success) }
    else
      json = { status: 'error', messages: subscribe.errors.full_messages }
    end
    respond_to do |format|
      format.json { render json: json }
    end
  end

  def confirmation
    render text: 'ololo'
  end

  private
    def subscribe_params
      params.require(:subscribe).permit(:name, :email)
    end
end

class PagesController < ApplicationController
  def idea
  end

  def invest
    @fundable_projects = Project.active.fundable
    @funded_projects = Project.active.funded
  end

  def about
  end

  def contact
  end

  def legal
  end

  # POST /contact
  def send_contact
    if  SubscribeMailer.contact_form(form_params).deliver_later
      render :status => 200,
             :json => { :status => 'success', :messages => 'Congrats! Your email successfully sent.' }
    else
      render :status => 422, :json => {:status => 'errors', :errors => 'Error.'}
    end
  end

  private
    def form_params
      params.require(:contact).permit(:email, :body)
    end
end

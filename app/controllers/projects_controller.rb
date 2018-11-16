class ProjectsController < ApplicationController
  include ApplicationHelper

  def index
    #@projects = Project.all
    #render json: @projects

  end

  def total_kwh
    @projects_kwh = kwh_projects_saved[:already_saved]
    render text: @projects_kwh
  end

  def show
    begin
      @project = Project.active.find(params[:id])
    rescue
      redirect_to root_path and return
    end
  end

  def avaible_participation
    respond_to do |format|
      format.json { render :json => Project.find_by(id: params[:id]).try(:avaible_participation) }
    end
  end

  def confirm_participation
    participations = params[:confirmCountField].to_i
    total_amount = params[:confirmTotalAmountField].to_f
    project_id = params[:project_id].to_i
    amount = (total_amount/participations).round(2)
    investor = Investor.create!( user_id: current_user.id,
                      project_id: project_id,
                      participations: participations,
                      amount: amount,
                      total_amount: total_amount,
                      pdf_name: "#{current_user.full_name.parameterize}_#{project_id}_#{Time.now.to_i}.pdf"
                      )
    if investor
      GeneratePdfJob.perform_later(investor)
    end
    render nothing: true
  end
end

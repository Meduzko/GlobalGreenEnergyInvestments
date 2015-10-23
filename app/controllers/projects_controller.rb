class ProjectsController < ApplicationController
  def index
  end

  def show
    begin
      @project = Project.active.find(params[:id])
        end
      end
    rescue
      redirect_to root_path and return
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
                      expired_datetime: 3.business_day.from_now)
    change_invested_amount(project_id, total_amount) if investor
    render      pdf: project_id, layout: 'layouts/payment_info.pdf.erb',
                margin: {top:               0,
                            bottom:            0,
                            left:              0,
                            right:             0 },
                save_to_file: Rails.root.join('public', "#{project_id}_#{Time.now.to_i}.pdf"),
                save_only: true

  end

  private
    def change_invested_amount(project_id, amount)
      Project.where(id: project_id).update_all("total_amount_invested = total_amount_invested + #{amount}")
    end
end

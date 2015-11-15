module ProjectsHelper
  def link_to_print(project_id, user_id)
    investor_pdf_file = Investor.where(project_id: @project.id).where(user_id: current_user.id).last.try(:pdf_name)
    link_to I18n.t(:cmn_print), pdf_file_path(investor_pdf_file), class: 'icon-font icon-pdf', target: '_blank' if investor_pdf_file
  end

  def saved_kwh(project_id)
    project = Project.find(project_id)
    ps = project.power_saved
    seconds = Time.now.minus_with_coercion(ps.started_at)
    result = ps.already_saved + seconds*ps.kwh_every_second
    result.round(2)
  end
end

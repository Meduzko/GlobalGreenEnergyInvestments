module ProjectsHelper
  def link_to_print(project_id, user_id)
    investor_pdf_file = Investor.where(project_id: @project.id).where(user_id: current_user.id).last.try(:pdf_name)
    link_to I18n.t(:cmn_print), pdf_file_path(investor_pdf_file), class: 'icon-font icon-pdf', target: '_blank' if investor_pdf_file
  end
end

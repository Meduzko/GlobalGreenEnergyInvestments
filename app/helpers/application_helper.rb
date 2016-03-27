module ApplicationHelper


  def kwh_projects_generated
    projects = Project.started.active
    if projects
      project_generating_now = projects.map(&:kwh_generated).inject(0){ |sum, hash| sum + hash[:already_generated] }
      kwh_in_second = projects.map(&:kwh_generated).inject(0){ |sum, hash| sum + hash[:kwh_interval] }
    else
      project_generating_now = 0
      project_generating_now = 0
    end
    {already_generated: project_generating_now.round(2), kwh_interval: kwh_in_second}
  end

  def kwh_generated_for_user
    projects = Project.started.where(id: current_user.investors.confirm.pluck(:project_id).uniq)
    project_generating_now = 0
    kwh_in_second = 0
    projects.each do |project|
      user_invested = current_user.investors.confirm.where(project_id: project.id).sum(:amount)
      percent = (user_invested*100/project.total_amount_need).round(2)
      kwh_generated = project.kwh_generated
      project_generating_now += ((kwh_generated[:already_generated]*percent)/100)
      kwh_in_second += ((kwh_generated[:kwh_interval]*percent)/100)
    end
    {already_generated: project_generating_now.round(2), kwh_interval: kwh_in_second}
  end

  def kwh_projects_saved
    projects = Project.started.active
    if projects
      project_generating_now = projects.map(&:kwh_saved).inject(0){ |sum, hash| sum + hash[:already_saved] }
      kwh_in_second = projects.map(&:kwh_saved).inject(0){ |sum, hash| sum + hash[:kwh_interval] }
    else
      project_generating_now = 0
      kwh_in_second = 0
    end
    {already_saved: project_generating_now.round(2), kwh_interval: kwh_in_second}
  end

  def kwh_saved_for_user
    projects = Project.started.where(id: current_user.investors.confirm.pluck(:project_id).uniq)
    project_generating_now = 0
    kwh_in_second = 0
    projects.each do |project|
      user_invested = current_user.investors.confirm.where(project_id: project.id).sum(:amount)
      percent = (user_invested*100/project.total_amount_need).round(2)
      kwh_saved = project.kwh_saved
      project_generating_now += kwh_saved[:already_saved] ? ((kwh_saved[:already_saved]*percent)/100) : 0
      kwh_in_second += kwh_saved[:kwh_interval] ? ((kwh_saved[:kwh_interval]*percent)/100) : 0
    end
    {already_saved: project_generating_now.round(2), kwh_interval: kwh_in_second}
  end

  def money_return_for_user
    money = 0
    current_user.projects.confirm_invest.payment_started.each do |project|
      months = TimeDifference.between(project.payments_start_date, Time.now).in_months.ceil
      months = months > project.payments_duration_months ? project.payments_duration_months : months
      participations = current_user.investors.confirm.where(project_id: project).sum(:participations)
      money += project.money_return_per_month * months * participations
    end
    money
  end

  def infographics_average
    projects = Project.active
    if projects.count > 0
      ((projects.map{ |x| ((x.irr/100).round(2)*x.total_amount_need).round }.inject(:+) / projects.map(&:total_amount_need).inject(:+).to_f)*100).round(1)
    else
      0
    end
  end

  def infographics_average_for_user
    projects = current_user.projects.confirm_invest.select('projects.irr, investors.total_amount')
    if projects.count > 0
      ((projects.map{ |x| ((x.irr/100).round(2)*x.total_amount).round }.inject(:+) / projects.map(&:total_amount).inject(:+).to_f)*100).round(1)
    else
      0
    end
  end

  def infographics_projects
    if is_my_investment_page?
      current_user.investors.confirm.pluck(:project_id).uniq.size
    else
      Project.active.count
    end
  end

  def infographics_invested
    if is_my_investment_page?
      current_user.investors.confirm.map(&:total_amount).inject(:+) || 0
    elsif is_project_page?
       @project.invested
    else
      Project.total_invested
    end
  end

  def is_my_investment_page?
    controller_name == 'profiles' && current_user || false
  end

  def is_project_page?
    controller_name == 'projects' && @project || false
  end

  def title_slug
    ' - ' + request.fullpath.split('/')[1].to_s.capitalize unless request.fullpath == '/'
  end

  def calculate_funded(amount_needed, amount_invested)

    funded = amount_needed > 0 ? (amount_invested*100)/amount_needed : 0
    number_with_precision(funded, strip_insignificant_zeros: true, precision: 2)
  end

  def cute_amount(amount)
    number_to_currency(amount, unit: "",  separator: "", delimiter: " ", precision: 0)
  end

  def nav_link(link_text, link_path)
    class_name = current_page?(link_path) ? 'active' : ''

    content_tag(:li, :class => class_name) do
      link_to link_text, link_path
    end
  end

  def generate_table(project_id = nil)
    return if project_id.nil?
    begin
      csv_file = Project.find(project_id).csv_name.path
      html = '<table>'
        table = CSV.table(csv_file, headers:false)
        html += '<thead>'
          html += '<tr>'
          table[0].each do |col|
              html +="<th>#{col}</th>"
          end
          html += '</tr>'
        html += '</thead>'

        html += '<tbody>'
        table[1..-1].each do |row|
          html += '<tr>'
            row.each do |col|
              html +="<td>#{col}</td>"
            end
          html += '</tr>'
        end
        html += '</tbody>'
      html += '</table>'
      html.html_safe
    rescue
      html = ''
    end
  end

  def icon_energy(type)
    case type
      when 'solar'
        'sun-icon'
      when 'wind'
        'wind-icon'
      when 'bio'
        'bio-icon'
      else
        'sun-icon'
      end
  end

end

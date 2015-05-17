module ApplicationHelper
  
  def calculate_funded(amount_needed, amount_invested)
    funded = (amount_invested*100)/amount_needed
    number_with_precision(funded, strip_insignificant_zeros: true)
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

  def project_stats(is_my_invest=false)
    projects = Project.active
    stat = ''
    stat += '<ul class="statistic-circles">'
      unless is_my_invest
        stat += '<li>'
          stat += '<div>'
          stat += User.count.to_s
          stat += '<span>'
            stat += I18n.t(:stat_investors)
          stat += '</span>'
          stat += '</div>'
        stat += '</li>'
      end
      stat += '<li>'
        stat += '<div>'
        stat += cute_amount(projects.map(&:total_amount_invested).inject(:+))
        stat += '<span>' 
          stat += I18n.t(:stat_invested)
        stat += '</span>'
        stat += '</div>'
      stat += '</li>'
      stat += '<li>'
        stat += '<div>'
        stat += projects.size.to_s
        stat += '<span>' 
          stat += I18n.t(:stat_projects)
        stat += '</span>'
        stat += '</div>'
      stat += '</li>'
      stat += '<li>'
        stat += '<div>'
        stat += projects.map(&:kwh_generated).inject(:+).to_s
        stat += '<span>' 
          stat += I18n.t(:stat_generated)
        stat += '</span>'
        stat += '</div>'
      stat += '</li>'
      stat += '<li>'
        stat += '<div>'
        stat += (projects.map(&:irr).inject(:+) / projects.size).round(2).to_s + '%'
        stat += '<span>' 
          stat += I18n.t(:stat_return)
        stat += '</span>'
        stat += '</div>'
      stat += '</li>'
      if is_my_invest
        stat += '<li>'
          stat += '<div>'
          stat += (projects.map(&:irr).inject(:+) / projects.size).round(2).to_s + '%'
          stat += '<span>'
            stat += I18n.t(:stat_total_return)
          stat += '</span>'
          stat += '</div>'
        stat += '</li>'
      end
    stat += '</ul>'
    stat.html_safe
  end

  def generate_table(project_id = nil)
    return if project_id.nil?
    begin
      csv_file = Amortization.find_by(project_id: project_id).csv_name.path
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

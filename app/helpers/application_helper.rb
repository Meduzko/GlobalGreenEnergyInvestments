module ApplicationHelper

  def title_slug
    ' - ' + request.fullpath.split('/')[1].to_s.capitalize unless request.fullpath == '/'
  end
  
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
    average_return = (projects.map(&:total_amount_need).inject(:+) / projects.map{ |x| ((x.irr/100).round(2)*x.total_amount_need).round }.inject(:+)).round(2)
    kwh_generated = projects.map{|x| x.kwh_generated if x.launch == true }.compact.inject(:+)
    investors = Investor.count - Investor.expired.checked.count
    stat = ''
    stat += '<ul class="statistic-circles">'
      unless is_my_invest
        stat += '<li>'
          stat += '<div>'
          stat += investors.to_s
          stat += '<span>'
            stat += I18n.t(:stat_investors)
          stat += '</span>'
          stat += '</div>'
        stat += '</li>'
      end
      stat += '<li>'
        stat += '<div>'
        stat += cute_amount(projects.map(&:total_amount_invested).inject(:+))
        stat += ' <sup>€</sup>'
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
        stat += number_with_precision(kwh_generated, strip_insignificant_zeros: true).to_s
        stat += '<span>' 
          stat += I18n.t(:stat_generated)
        stat += '</span>'
        stat += '</div>'
      stat += '</li>'
      stat += '<li>'
        stat += '<div>'
        stat += number_with_precision(average_return, strip_insignificant_zeros: true).to_s + '%'
        stat += '<span>' 
          stat += I18n.t(:stat_return)
        stat += '</span>'
        stat += '</div>'
      stat += '</li>'
      if is_my_invest
        stat += '<li>'
          stat += '<div>'
          stat += (projects.map(&:total_amount_invested).inject(:+)).round(2).to_s + ' <sup>€</sup>'
          stat += '<span>'
            stat += I18n.t(:stat_total_return)
          stat += '</span>'
          stat += '</div>'
        stat += '</li>'
      end
      stat += total_saved_kwh_html if Project.power_saved.count > 0
    stat += '</ul>'
    stat.html_safe
  end

  def total_saved_kwh_html
    stat = '<li>'
      stat += '<div>'
      stat += "<div data-jscomp='components/statisticCounter' data-jscomp-config='{\"stepValue\": \"#{total_saved_kwh[:total_kwd_seconds]}\" }'>"
      stat += '<p class="savedStatistic">' + total_saved_kwh[:total_saved].round(2).to_s + '</p>'
      stat += '<span>'
        stat += I18n.t(:stat_saved)
      stat += '</span>'
      stat += '</div>'
    stat += '</li>'
    stat
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


  def saved_kwh(project_id, every_second = false)
    project = Project.find(project_id)
    ps = project.power_saved
    seconds = Time.now.minus_with_coercion(ps.started_at)
    result = ps.already_saved + seconds*ps.kwh_every_second
    return every_second ? {saved: result.round(2), every_second: ps.kwh_every_second} : result.round(2)
  end

  def total_saved_kwh
    projects = Project.active.select{|p| p.is_power_saved? }
    kwh_hash = projects.map{ |ps| saved_kwh(ps.id, true) }
    kwd_saved = kwh_hash.map{ |h| h[:saved]}.sum
    kwd_seconds = kwh_hash.map{ |h| h[:every_second]}.sum
    return {total_saved: kwd_saved, total_kwd_seconds: kwd_seconds}
  end
end

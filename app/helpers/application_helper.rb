module ApplicationHelper

  def infographics_average
    if is_my_investment_page?
      projects = Project.active
    else
      projects = Project.active
    end
    ((projects.map{ |x| ((x.irr/100).round(2)*x.total_amount_need).round }.inject(:+) / projects.map(&:total_amount_need).inject(:+).to_f)*100).round(1)
  end

  def infographics_projects
    if is_my_investment_page?
      current_user.investors.confirm.map(&:project_id).uniq.size
    else
      Project.active.count
    end
  end

  def infographics_invested
    if is_my_investment_page?
      current_user.investors.confirm.map(&:total_amount).inject(:+) || 0
    else
      Project.project_count
    end
  end

  def is_my_investment_page?
    controller_name == 'profiles' && current_user || false
  end

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
    average_return = (projects.map{ |x| ((x.irr/100).round(2)*x.total_amount_need).round }.inject(:+) / projects.map(&:total_amount_need).inject(:+).to_f)*100.round(2)
    kwh_generated = projects.map{|x| x.kwh_generated if x.launch == true }.compact.inject(:+)
    stat = ''
    stat += '<ul class="statistic-circles">'
      unless is_my_invest
        stat += '<li>'
          stat += '<div>'
          stat += investor_stats.to_s
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
        stat += number_with_precision(average_return, strip_insignificant_zeros: true).to_s + '%'
        stat += '<span>'
          stat += I18n.t(:stat_return)
        stat += '</span>'
        stat += '</div>'
      stat += '</li>'
      if kwh_generated.present?
        stat += '<li>'
          stat += '<div>'
          stat += number_with_precision(kwh_generated, strip_insignificant_zeros: true).to_s
          stat += '<span>'
            stat += I18n.t(:stat_generated)
          stat += '</span>'
          stat += '</div>'
        stat += '</li>'
      end
      if is_my_invest && current_user && current_user.money_returns.count > 0
        stat += '<li>'
          stat += '<div>'
          stat += total_money_return.to_s + ' <sup>€</sup>'
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


  def my_investment
    return unless current_user
    @count_projects = count_projects = current_user.investors.paid.map(&:project_id).uniq
    projects = Project.where(id: count_projects)
    average_return = count_projects.empty? ? 0 : (projects.map{ |x| ((x.irr/100).round(2)*x.total_amount_need).round }.inject(:+) / projects.map(&:total_amount_need).inject(:+).to_f)*100.round(2)
    kwh_generated = count_projects.empty? ? 0 : projects.map{|x| x.kwh_generated if x.launch == true }.compact.inject(:+)
    @invested = invested = count_projects.empty? ? 0 : current_user.investors.paid.map(&:total_amount).inject(:+)
    stat = ''
    stat += '<ul class="statistic-circles">'
      stat += '<li>'
        stat += '<div>'
        stat += cute_amount(invested)
        stat += ' <sup>€</sup>'
        stat += '<span>'
          stat += I18n.t(:stat_invested)
        stat += '</span>'
        stat += '</div>'
      stat += '</li>'
      stat += '<li>'
        stat += '<div>'
        stat += count_projects.size.to_s
        stat += '<span>'
          stat += I18n.t(:stat_projects)
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
      if kwh_generated.present?
        stat += '<li>'
          stat += '<div>'
          stat += number_with_precision(kwh_generated, strip_insignificant_zeros: true).to_s
          stat += '<span>'
            stat += I18n.t(:stat_generated)
          stat += '</span>'
          stat += '</div>'
        stat += '</li>'
      end
      if current_user.money_returns.count > 0
        stat += '<li>'
          stat += '<div>'
          stat += total_money_return.to_s + ' <sup>€</sup>'
          stat += '<span>'
            stat += I18n.t(:stat_total_return)
          stat += '</span>'
          stat += '</div>'
        stat += '</li>'
      end
      stat += total_saved_kwh_html if Project.power_saved.count > 0 && count_projects.present?
    stat += '</ul>'
    stat.html_safe
  end

  def investor_stats
    Investor.paid.map(&:user_id).uniq.count
  end

  def total_money_return
    return 0 unless current_user
    amount = 0
    current_user.money_returns.each do |mr|
      amount += TimeDifference.between(mr.start_paid, Time.now).in_months.ceil*mr.amount if mr.end_paid.nil?
      amount += TimeDifference.between(mr.start_paid, mr.end_paid,).in_months.ceil*mr.amount if mr.end_paid.present? && mr.end_paid > mr.start_paid
    end
    amount
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


  def saved_kwh(project_id, every_second = false)
    project = Project.find(project_id)
    ps = project.power_saved
    seconds = Time.now.minus_with_coercion(ps.started_at)
    result = ps.already_saved + seconds*ps.kwh_every_second
    return every_second ? {saved: result.round(2), every_second: ps.kwh_every_second} : result.round(2)
  end

  def total_saved_kwh
    if current_user && @count_projects
      projects = Project.power_saved.where(id: @count_projects)
      amount_needed = projects.map(&:total_amount_need).inject(:+)
      persent = (@invested/amount_needed).round(2)
    else
      projects = Project.power_saved
    end
    kwh_hash = projects.map{ |ps| saved_kwh(ps.id, true) }

    kwd_saved = kwh_hash.map{ |h| h[:saved]}.sum
    kwd_saved = kwd_saved*persent if persent.present?

    kwd_seconds = kwh_hash.map{ |h| h[:every_second]}.sum
    kwd_seconds = kwd_seconds*persent if persent.present?

    return {total_saved: kwd_saved, total_kwd_seconds: kwd_seconds}
  end

  def return_money(project_id)
  end
end

class GeneratePdfJob < ActiveJob::Base
  queue_as :default

  def perform(investor)
    return if investor.nil?
    av = ActionView::Base.new()
    av.view_paths = ActionController::Base.view_paths
    av.class_eval do
      include Rails.application.routes.url_helpers
      include ApplicationHelper
    end

    pdf_html = av.render  template: "investor/show.pdf.erb",
                          layout: 'layouts/payment_info.pdf.erb',
                          locals: {investor: investor}

    gen_pdf = WickedPdf.new.pdf_from_string(pdf_html, margin: {top:0, bottom:0, left:0, right:0} )

    pdf_path = Rails.root.join('public/pdf', investor.pdf_name)
    File.open(pdf_path, 'wb') do |file|
      file << gen_pdf
    end
    if File.exist?(pdf_path) && investor
      InvestorMailer.new_investor(investor.user, pdf_path).deliver
      InvestorMailer.new_investor_copy(investor).deliver
    end
  end
end

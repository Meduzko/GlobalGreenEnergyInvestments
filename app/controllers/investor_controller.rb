class InvestorController < ApplicationController
  def show
    @investor = Investor.find_by_pdf_name("#{params[:file_name]}.pdf")
    pdf_file_path = Rails.root.join("public/pdf", "#{params[:file_name]}.pdf")
    if @investor && File.exist?(pdf_file_path)
      send_file pdf_file_path
    elsif @investor
      generate_pdf(@investor.pdf_name)
    else
      redirect_to root_path
    end
  end

  private
    def generate_pdf(file_name)
      render  pdf: file_name, 
              layout: 'layouts/payment_info.pdf.erb',
              margin: {top:   0,
                      bottom: 0,
                      left:   0,
                      right:  0}
    end
end

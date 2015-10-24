class AddPdfFileToInvestor < ActiveRecord::Migration
  def change
    add_column :investors, :pdf_name, :string
  end
end

class AddPdfFileToProject < ActiveRecord::Migration
  def change
    add_column :projects, :pdf, :string
  end
end

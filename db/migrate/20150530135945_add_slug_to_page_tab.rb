class AddSlugToPageTab < ActiveRecord::Migration
  def change
    add_column :page_tabs, :slug_ancor, :string
  end
end

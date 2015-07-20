class ChangeSlugAncorToSlugOnPageTab < ActiveRecord::Migration
  def change
    rename_column :page_tabs, :slug_ancor, :slug
  end
end

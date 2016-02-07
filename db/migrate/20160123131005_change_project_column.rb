class ChangeProjectColumn < ActiveRecord::Migration
  def change
    add_column :projects, :number_of_participations, :integer, default: 0
    remove_column :projects, :amount_to_invest
  end
end

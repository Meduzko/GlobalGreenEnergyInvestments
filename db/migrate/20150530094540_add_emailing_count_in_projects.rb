class AddEmailingCountInProjects < ActiveRecord::Migration
  def change
    add_column :projects, :sent_subscription, :integer, default: 0
  end
end

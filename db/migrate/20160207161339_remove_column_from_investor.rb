class RemoveColumnFromInvestor < ActiveRecord::Migration
  def change
    remove_column :investors, :expired_datetime
    remove_column :investors, :check_expired
  end
end

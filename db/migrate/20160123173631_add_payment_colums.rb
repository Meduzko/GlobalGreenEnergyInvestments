class AddPaymentColums < ActiveRecord::Migration
  def change
    add_column :projects, :payments_start_date, :date
    add_column :projects, :payments_duration_months, :integer, default: 0
    add_column :projects, :money_return_per_month, :float, default: 0
  end
end

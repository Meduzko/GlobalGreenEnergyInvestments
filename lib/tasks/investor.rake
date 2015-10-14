namespace :investor do
  desc "Check payments from Investors"
  task check_payments: :environment do
    Investor.expired.unchecked.each do |investor|
      ActiveRecord::Base.transaction do
        changed_total_amount_invested = investor.project.total_amount_invested - investor.amount
        investor.project.update(total_amount_invested: changed_total_amount_invested)
        investor.update(check_expired: true)
      end
    end
  end
end

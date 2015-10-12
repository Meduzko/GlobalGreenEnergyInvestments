namespace :investor do
  desc "Check payments from Investors"
  task check_payments: :environment do
  	Investor.expired.each do |investor|
  		# descrease for each project amount and add new attribute for this
  	end
  end
end

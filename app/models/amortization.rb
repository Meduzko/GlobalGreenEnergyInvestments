class Amortization < ActiveRecord::Base
  belongs_to :project

  mount_uploader :csv_name, AmortizationUploader
end

class Investor < ActiveRecord::Base
  belongs_to :user
  belongs_to :project

  scope :unconfirm, ->{ where(confirm_paid: false) }
  scope :confirm,   ->{ where(confirm_paid: true) }

  def is_paid?
    self.confirm_paid
  end

  def self.investor_count
    self.confirm.map(&:user_id).uniq.count
  end
end

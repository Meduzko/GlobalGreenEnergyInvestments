class Investor < ActiveRecord::Base
  belongs_to :user
  belongs_to :project

  def is_expired?
    self.expired_datetime < Time.now
  end

  def is_paid?
    self.confirm_paid
  end
end

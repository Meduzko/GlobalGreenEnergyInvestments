class Investor < ActiveRecord::Base
  belongs_to :user
  belongs_to :project

  scope :expired,   ->{ where('expired_datetime < ? and confirm_paid = ?', Time.now, false) }
  scope :unconfirm, ->{ where(confirm_paid: false) }
  scope :confirm,   ->{ where(confirm_paid: true) }

  def is_expired?
    self.expired_datetime < Time.now && self.confirm_paid == false
  end

  def is_paid?
    self.confirm_paid
  end
end

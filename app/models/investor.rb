class Investor < ActiveRecord::Base
  belongs_to :user
  belongs_to :project

  scope :expired,   ->{ where('expired_datetime < ? and confirm_paid = ?', Time.now, false) }
  scope :unchecked, ->{ where(check_expired: false) }
  scope :checked,   ->{ where(check_expired: true) }
  scope :unconfirm, ->{ where(confirm_paid: false) }
  scope :confirm,   ->{ where(confirm_paid: true) }
  scope :paid,      ->{ where('confirm_paid = 1 or (confirm_paid = 0 and expired_datetime > ?)', Time.now) }

  def is_expired?
    self.expired_datetime < Time.now && self.confirm_paid == false
  end

  def is_paid?
    self.confirm_paid
  end
end

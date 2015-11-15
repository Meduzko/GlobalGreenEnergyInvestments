class PowerSaved < ActiveRecord::Base

  DAY_IN_MONTH = 30

  belongs_to :project

  before_save :save_old_info

  def kwh_every_second
    self.kwh_at_month / DAY_IN_MONTH / 24 / 3600
  end

  def save_old_info
    return if self.new_record?
    seconds = Time.now.minus_with_coercion(self.started_at)
    result = self.already_saved + seconds*(self.kwh_at_month_was / DAY_IN_MONTH / 24 / 3600)
    self.already_saved = result.round(2)
  end
end

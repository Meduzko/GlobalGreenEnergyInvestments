class Project < ActiveRecord::Base

  PARTICIPATION = ['shares', 'debentures']
  ENERGY = ['solar', 'wind', 'bio', 'etc']
  BANK_ACCOUNT = 'NL67TRIO0254752357'

  scope :active,          -> { where(status: true).order('created_at desc') }
  scope :started,         -> { where('kwh_start_date <= ?', Time.now.to_date) }
  scope :payment_started, -> { where('payments_start_date <= ?', Time.now.to_date) }
  scope :confirm_invest,  -> { where('investors.confirm_paid = 1') }

  has_many :investors

  before_validation :remove_images
  before_save       :set_default_values

  mount_uploader :small_foto, ProjectUploader
  mount_uploader :big_foto,   ProjectUploader
  mount_uploader :img_1,      ProjectUploader
  mount_uploader :img_2,      ProjectUploader
  mount_uploader :img_3,      ProjectUploader
  mount_uploader :img_4,      ProjectUploader
  mount_uploader :img_5,      ProjectUploader
  mount_uploader :pdf,        ProjectPdfUploader
  mount_uploader :csv_name, AmortizationUploader

  def launch?
    (self.kwh_start_date && (self.kwh_start_date <= Time.now.to_date)) || false
  end

  def kwh_generated
    if self.launch? && self.kwh_generated_per_month > 0
      period_in_seconds = TimeDifference.between(self.kwh_start_date, Time.now).in_seconds
      kwh_in_second = self.kwh_generated_per_month.to_f/30.days.to_i
      project_generating_now = period_in_seconds*kwh_in_second + self.kwh_already_have
    else
      project_generating_now = 0
      kwh_in_second = 0
    end
    {already_generated: project_generating_now.round(2), kwh_interval: kwh_in_second}
  end

  def kwh_saved
    if self.launch? && self.kwh_saved_per_month > 0
      period_in_seconds = TimeDifference.between(self.kwh_start_date, Time.now).in_seconds
      kwh_in_second = self.kwh_saved_per_month.to_f/30.days.to_i
      project_saving_now = period_in_seconds*kwh_in_second + self.kwh_already_have
    else
      project_saving_now = 0
      kwh_in_second = 0
    end
    {already_saved: project_saving_now.round(2), kwh_interval: kwh_in_second}
  end

  # Minimun amount to invest
  def amount_to_invest
    self.number_of_participations > 0 ? self.total_amount_need / self.number_of_participations : 0
  end

  # Total interest_paid
  def interest_paid
    self.payments_duration_months * self.money_return_per_month
  end

  def invested
    self.investors.confirm.map(&:total_amount).sum + self.total_amount_invested
  end

  # Total amount invested for all projects (confim paid + already total invested)
  def self.total_invested
    self.active.joins(:investors).confirm_invest.sum(:total_amount) + self.active.pluck(:total_amount_invested).sum
  end

  def avaible_participation
    { project_id: self.id,
      total_participation:   self.number_of_participations,
      avaible_participation: self.number_of_participations - self.investors.confirm.sum(:participations) }
  end

  private
    def remove_images
      self.remove_small_foto! if self.remove_small_foto == '1'
      self.remove_big_foto!   if self.remove_big_foto == '1'
      self.remove_img_1!      if self.remove_img_1 == '1'
      self.remove_img_2!      if self.remove_img_2 == '1'
      self.remove_img_3!      if self.remove_img_3 == '1'
      self.remove_img_4!      if self.remove_img_4 == '1'
      self.remove_img_5!      if self.remove_img_5 == '1'
      self.remove_pdf!        if self.remove_pdf == '1'
      self.remove_csv_name!        if self.remove_csv_name == '1'
    end

    def set_default_values
      self.kwh_generated_per_month = 0 if self.kwh_generated_per_month.nil?
      self.kwh_already_have = 0 if self.kwh_already_have.nil?
      self.kwh_saved_per_month = 0 if self.kwh_saved_per_month.nil?
      self.total_amount_need = 0 if self.total_amount_need.nil?
      self.total_amount_invested = 0 if self.total_amount_invested.nil?
      self.irr = 0 if self.irr.nil?
    end

end

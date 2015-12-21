class Project < ActiveRecord::Base

  PARTICIPATION = ['shares', 'debentures']
  ENERGY = ['solar', 'wind', 'bio', 'etc']
  BANK_ACCOUNT = 'NL67TRIO0254752357'

  has_one :amoritisaztion, dependent: :destroy
  has_one :power_saved,    dependent: :destroy
  has_many :investors

  before_validation :remove_images

  scope :active,      -> { where(status: true).order('created_at desc') }
  scope :fundable,    -> { where('projects.total_amount_need != projects.total_amount_invested AND projects.total_amount_need > projects.total_amount_invested') }
  scope :funded,      -> { where('projects.total_amount_invested >= projects.total_amount_need') }
  scope :power_saved, -> { joins(:power_saved).where(["power_saveds.started_at < ?", Time.now]) }

  mount_uploader :small_foto, ProjectUploader
  mount_uploader :big_foto,   ProjectUploader
  mount_uploader :img_1,      ProjectUploader
  mount_uploader :img_2,      ProjectUploader
  mount_uploader :img_3,      ProjectUploader
  mount_uploader :img_4,      ProjectUploader
  mount_uploader :img_5,      ProjectUploader
  mount_uploader :pdf,        ProjectPdfUploader
  mount_uploader :csv_name, AmortizationUploader

  def is_power_saved?
    self.power_saved && (self.power_saved.started_at < Time.now)
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

end

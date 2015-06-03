class Project < ActiveRecord::Base

  has_one :amoritisaztion, dependent: :destroy

  before_validation :remove_images
  scope :active, -> { where(status: true).order('created_at desc') }

  mount_uploader :small_foto, ProjectUploader
  mount_uploader :big_foto, ProjectUploader
  mount_uploader :img_1, ProjectUploader
  mount_uploader :img_2, ProjectUploader
  mount_uploader :img_3, ProjectUploader
  mount_uploader :img_4, ProjectUploader
  mount_uploader :img_5, ProjectUploader

  PARTICIPATION = ['shares', 'debentures']
  ENERGY = ['solar', 'wind', 'bio', 'etc']


  def remove_images
    self.remove_small_foto! if self.remove_small_foto == '1'
    self.remove_big_foto! if self.remove_big_foto == '1'
    self.remove_img_1! if self.remove_img_1 == '1'
    self.remove_img_2! if self.remove_img_2 == '1'
    self.remove_img_3! if self.remove_img_3 == '1'
    self.remove_img_4! if self.remove_img_4 == '1'
    self.remove_img_5! if self.remove_img_5 == '1'
  end


end

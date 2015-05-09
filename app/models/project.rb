class Project < ActiveRecord::Base
  mount_uploader :small_foto, ProjectUploader
  mount_uploader :big_foto, ProjectUploader

  before_validation :remove_images

  PARTICIPATION = ['shares', 'debentures']


  def remove_images
    self.remove_small_foto! if self.remove_small_foto == '1'
    self.remove_big_foto! if self.remove_big_foto == '1'
  end


end

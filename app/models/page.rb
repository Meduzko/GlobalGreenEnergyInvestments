class Page < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, :use => [:slugged, :finders]
  
  has_many :page_tabs

  scope :active, -> { where(status: true) }
end

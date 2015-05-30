class Page < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, :use => [:slugged, :finders]
  
  has_many :page_tabs, dependent: :destroy

  scope :active, -> { where(status: true) }
end

class PageTab < ActiveRecord::Base
  extend FriendlyId
  friendly_id :tab_name, :use => [:slugged, :finders]

  belongs_to :page

  default_scope { order(:position) }
  scope :active, -> { where(status: true) }

end

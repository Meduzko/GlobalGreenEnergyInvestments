class PageTab < ActiveRecord::Base
  belongs_to :page

  default_scope { order(:position) }
  scope :active, -> { where(status: true) }
end

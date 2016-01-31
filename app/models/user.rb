class User < ActiveRecord::Base
  has_one :profile, dependent: :destroy
  has_many :investors, dependent: :destroy

  enum role: [:regular, :applicant, :investor]

  devise :database_authenticatable, :registerable, :confirmable, :recoverable, :rememberable, :trackable, :validatable
  validates :first_name, presence: true
  validates :last_name, presence: true

  scope :with_investment, -> { joins(:investors).uniq }

  def full_name
    " #{self.first_name.camelcase} #{self.last_name.camelcase} "
  end
end

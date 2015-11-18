class User < ActiveRecord::Base
  has_one :profile, dependent: :destroy
  has_many :investors
  has_many :money_returns

  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable
  validates :first_name, presence: true
  validates :last_name, presence: true

  def full_name
    " #{self.first_name} #{self.last_name} "
  end
end

class HomeController < ApplicationController

  def index
    @projects = Project.active
  end

end


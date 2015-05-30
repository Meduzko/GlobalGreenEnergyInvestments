class HomeController < ApplicationController

  def index
    @projects = Project.active.limit(1)
  end

end


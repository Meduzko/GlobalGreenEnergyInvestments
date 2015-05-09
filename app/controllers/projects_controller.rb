class ProjectsController < ApplicationController
  def index
  end

  def show
    begin
      @project = Project.active.find(params[:id])
    rescue
      redirect_to root_path and return
    end
  end
end

class PagesController < ApplicationController
  def show
    @page = Page.active.find_by_slug(params[:slug])
    if @page
      @tabs = @page.page_tabs.active
    else
      redirect_to root_path and return
    end
  end
end

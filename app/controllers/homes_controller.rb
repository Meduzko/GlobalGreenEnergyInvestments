class HomesController < InheritedResources::Base

  private

    def home_params
      params.require(:home).permit()
    end
end


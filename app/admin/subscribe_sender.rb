ActiveAdmin.register_page "SubscribeSender" do
  menu false

  action_item only: :index do
    link_to 'Back to subscibers', admin_subscribes_path
  end

   content do
    para 'in progress'
#        form :action => '', :method => :post do |f|
#            f.input name: :subject
#        end
    end

end

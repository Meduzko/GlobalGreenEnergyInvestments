ActiveAdmin.register_page "Dashboard" do

  menu priority: 1, label: proc{ I18n.t("active_admin.dashboard") }

  content title: proc{ I18n.t("active_admin.dashboard") } do
    #div class: "blank_slate_container", id: "dashboard_default_message" do
    #  span class: "blank_slate" do
    #    span I18n.t("active_admin.dashboard_welcome.welcome")
    #    small I18n.t("active_admin.dashboard_welcome.call_to_action")
    #  end
    #end

    # Here is an example of a simple dashboard with columns and panels.
    #
     columns do
       column do
         panel "Recent Users" do
           ul do
             User.limit(10).order('created_at desc').each do |user|
               li link_to "#{user.full_name} - #{time_ago_in_words(user.created_at)} ago", admin_user_path(user.id)
             end
           end
         end
       end
       column do
         panel "Recent Subscriptions" do
           ul do
             Subscribe.limit(10).order('created_at desc').each do |s|
               li link_to "#{s.name} - #{time_ago_in_words(s.created_at)} ago", admin_subscribe_path(s.id)
             end
           end
         end
       end
     end
     columns do
      column do
         panel "Investors" do
           ul do
             Investor.limit(10).order('created_at desc').each do |s|
               li link_to "#{s.user.full_name} - #{time_ago_in_words(s.created_at)} ago", admin_subscribe_path(s.id)
             end
           end
         end
       end
     end
  end # content
end

define(["jquery"],function(e){"use strict";return{init:function(n,t){this.domId=e("#"+n)},resetState:function(){e(".mobileMenu span").removeClass("icon-cancel"),e(".mobileMenu ul").slideUp(100)},handleMenu:function(n){e(n).hasClass("icon-cancel")?this.resetState():(this.resetState(),this.domId.find(".menu-control").addClass("icon-cancel"),this.domId.find("ul").slideDown(300))}}});
define(["jquery","jquery.responsiveTabs"],function(e){"use strict";return{init:function(i){var o=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()),r=e("#"+i).responsiveTabs({active:0,scrollToAccordion:o,setHash:!0,rotate:!1,collapsible:!1,duration:500}).show();r.on("tabs-activate",function(){compSupport.callFunc("#editProfileForm","checkIfPrefilledAreValid")})}}});
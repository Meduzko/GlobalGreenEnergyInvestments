define(["jquery"],function(e){"use strict";return{init:function(s,t){this.domId=e("#"+s),this.updatingLayer=".updating-layer",this.mesageBox=".message-box"},showUpdatingLayer:function(){this.domId.find(this.updatingLayer).show()},hideUpdatingLayer:function(){this.domId.find(this.updatingLayer).hide()},showMessage:function(e,s){this.domId.find(this.mesageBox).html('<div class="'+s+'-msg">'+e+"</div>")},sendForm:function(){var s=this,t=this.domId.find("form"),i=t.serialize();t.valid()&&(s.showUpdatingLayer(),e.ajax({beforeSend:function(s){s.setRequestHeader("X-CSRF-Token",e('meta[name="csrf-token"]').attr("content"))},complete:function(){s.hideUpdatingLayer()},method:"POST",url:"/contact.json",data:i}).done(function(e){"error"===e.status?s.showMessage(e.messages,"error"):s.showMessage(e.messages,"success")}).fail(function(e){s.showMessage(e.messages,"error")}))}}});
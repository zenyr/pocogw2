AppModules.pve = function (root) {
  var events,eventNames;
  
  
  var self = {
    
    init:function(){
      delete self.init;
      root.fetch('https://api.guildwars2.com/v1/event_details.json').done(function(){
        
      });
    }
  };
  return self;
};
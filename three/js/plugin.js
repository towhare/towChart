(function(undefined){
   var _global;
   var plugin = {
       add:function(n1,n2){return n1 + n2}
   }
   _global = (function(){return this || (0,eval)('this');}());
   if(typeof module !== 'undefined' && module.exports){
       module.exports = plugin;
   }else if(typeof define === 'function' && define.amd){
       define(function(){return plugin});
   }else{!('plugin' in _global ) && (_global.plugin = plugin)}
}());

(function(undefined){
    var _global;
    var plu = {
        init:function(){
            console.log('plugin init')
        }

    }
    _global = (function(){return this || (0,eval)('this')}())
    if(typeof module !== 'undefined' && module.exports){
        module.exports = plu;
    }else if(typeof define === 'function' && define.amd){
        define(function(){return plu});
    }else{
        !( 'plu' in _global) && (_global.plu = plu)
    }
}());
plu.init()



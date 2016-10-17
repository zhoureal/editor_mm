(function(){

    UE.Editor.prototype.loadServerConfig = function(){
        var me = this;

        function showErrorMsg(msg) {
        }
    };

    UE.Editor.prototype.isServerConfigLoaded = function(){
        var me = this;
        return me._serverConfigLoaded || false;
    };

    UE.Editor.prototype.afterConfigReady = function(handler){
        if (!handler || !utils.isFunction(handler)) return;
        var me = this;
        var readyHandler = function(){
            handler.apply(me, arguments);
            me.removeListener('serverConfigLoaded', readyHandler);
        };

        if (me.isServerConfigLoaded()) {
            handler.call(me, 'serverConfigLoaded');
        } else {
            me.addListener('serverConfigLoaded', readyHandler);
        }
    };

})();

(function() {
    var Vue = require("vue");
    
    Vue.directive('draggable', {
        bind: function () {
            var el = this.el;
            var root = document.documentElement;
            var dragging = false;
            var diff = {x: 0, y: 0};
            el.onmousedown = function(e){
                var rect = el.getBoundingClientRect();
                var left = window.pageXOffset || root.scrollLeft;
                var top  = window.pageYOffset || root.scrollTop;
                el.style.left = (rect.left + left) + 'px';
                el.style.top = (rect.top + top) + 'px';
                diff.x = e.clientX - rect.left + left;
                diff.y = e.clientY - rect.top + top;
                dragging = true;
                // TODO: to be callback
                el.style.transition = "none";
            };
            document.onmouseup = function(e){
                dragging = false;
                // TODO: to be callback
                el.style.transition = "all 0.8s ease";
            };
            document.onmousemove = function(e){
                if(dragging){
                    if(!e){ e = window.event; }
                    var left = window.pageXOffset || root.scrollLeft;
                    var top  = window.pageYOffset || root.scrollTop;
                    el.style.left = left + e.clientX - diff.x + 'px';
                    el.style.top = top + e.clientY - diff.y + 'px';
                }
            };

        }
    });
})();
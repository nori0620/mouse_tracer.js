var com ={}; com.nori0620 = {}; com.nori0620.mouse_tracer = {};
var ns = com.nori0620.mouse_tracer;

/*global document window */
(function(){

    /* --- Utilites ---- */
    var Utils = {
        current_time: function(){
            var now = new Date();
            return parseInt( now.getTime(), '0X' );  
        }
    };
    var HtmlHeplers = {
        renderController : function(){
            var controller = document.createElement('div');
            controller.appendChild( document.createTextNode('StopAndReplay') );
            controller.style.background = "#FFF";
            controller.style.border     = "3px solid #F00";
            controller.style.position = 'absolute';
            controller.style.top   = 0;
            controller.style.right = 0;
            controller.style.zIndex = 9999999;
            controller.addEventListener('click',function(){
                ns.replay();
                controller.style.display = 'none';
            },true);
            document.body.appendChild(controller);
        },
        renderCanvas : function(){
            var canvas = document.createElement('canvas');
            canvas.style.width  = document.body.clientWidth  + "px";
            canvas.style.height = document.body.clientHeight + "px";
            canvas.width  = document.body.clientWidth;
            canvas.height = document.body.clientHeight;
            canvas.style.zIndex = 9999999;
            canvas.style.position = 'absolute';
            canvas.style.top  = 0;
            canvas.style.left = 0;
            document.body.appendChild(canvas);
            return canvas;
        }
    };

    /* --- History ---- */
    var History = function(start_time){
        this.records    = [];
        this.start_time = start_time;
    };
    (function(proto){
        proto.addRecord = function(mouseEvent){
            var time = Utils.current_time() - this.start_time;
            this.records[time] = {
                type  : mouseEvent.type,
                x     : mouseEvent.pageX,
                y     : mouseEvent.pageY,
                time  : time
            };
        };
        proto.clear = function(){
            this.records = [];
        };
        proto.dump  = function(){
            return this.records;
        };
    }(History.prototype));

    /* --- Replayer ---- */
    var Replayer = function(history){
        this.history  = history;
        this.canvas   = null;
        this.FRAME_INTERVAL = 10;
        this.current_frame  = 1;
    };
    (function(proto){
        proto.play = function(canvas){
            if(!canvas.getContext){
                throw "canvas is invalid";
            }
            this.canvas = canvas;
            var that = this;
            window.setInterval(
                function(){ that.render_frame(); } ,
                this.FRAME_INTERVAL
            );
        };
        proto.render_frame = function(){
            var ctx = this.canvas.getContext('2d');
            var records = this.history.records;
            var from = ( this.current_frame -1 )*this.FRAME_INTERVAL;
            var to   = this.current_frame*this.FRAME_INTERVAL;

            var record,i;
            for( i=from; i < to; i++){ 
                record = records[i];
                if( record ){
                    ctx.fillRect(record.x,record.y,3,3);
                }
            }
            this.current_frame++;
        };
    }(Replayer.prototype));

    /* --- Export --------- */
    (function(){
        var history = new History( Utils.current_time() );
        var recorder = function(e){ history.addRecord(e); };
        ns.record = function(){
            HtmlHeplers.renderController();
            document.body.addEventListener("mousemove",recorder, true );
            document.body.addEventListener("click", recorder, true);
        };
        ns.replay = function(){
            var canvas = HtmlHeplers.renderCanvas();
            document.body.removeEventListener("mousemove", recorder, true);
            document.body.removeEventListener("click", recorder, true);
            var replayer = new Replayer(history);
            replayer.play( canvas );
        };
    }());

}());

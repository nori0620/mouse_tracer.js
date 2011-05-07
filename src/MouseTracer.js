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
        overlayCanvas : function(){
            var canvas = document.createElement('canvas');
            canvas.style.width  = document.body.clientWidth  + "px";
            canvas.style.height = document.body.clientHeight + "px";
            canvas.width  = document.body.clientWidth;
            canvas.height = document.body.clientHeight;
            canvas.style.zIndex = 999999;
            canvas.style.position = 'absolute';
            canvas.style.top  = 0;
            canvas.style.left = 0;
            document.body.appendChild(canvas);
            return canvas;
        }
    };

    /* --- TraceLog ---- */
    var TraceLog = function(start_time){
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
    }(TraceLog.prototype));

    /* --- Replayer ---- */
    var Replayer = function(trace_log){
        this.trace_log  = trace_log;
        this.FRAME_INTERVAL = 10;
        this.current_frame  = 1;
        this.canvas      = null;
        this.interval_id = null;
        this.callback    = null;
        this.render_record_count = 0;
    };
    (function(proto){
        proto.play = function(canvas, callback){
            if(!canvas.getContext){
                throw "canvas is invalid";
            }
            this.canvas = canvas;
            this.callback = callback;
            var that = this;
            this.interval_id = window.setInterval(
                function(){ that.render_frame(); } ,
                that.FRAME_INTERVAL
            );
        };
        proto.render_frame = function(){
            var ctx = this.canvas.getContext('2d');
            var records = this.trace_log.records;
            var from = ( this.current_frame -1 )*this.FRAME_INTERVAL;
            var to   = this.current_frame*this.FRAME_INTERVAL;
            var renderer = new Renderer(ctx);

            var record,i;
            for( i=from; i < to; i++){ 
                record = records[i];
                if( record ){
                    renderer.render( record );
                }
                this.render_record_count++;
                if( this.render_record_count > records.length ){
                    window.clearInterval( this.interval_id );
                    if( this.callback ){ this.callback() };
                    break;
                }
            }
            this.current_frame++;
        };
    }(Replayer.prototype));

    /* --- Renderer ---- */
    var Renderer = function(context){
        this.context = context;
    };
    (function(proto){
        proto.render = function(record){
            if( record.type == 'mousemove' ){
                this._render_mousemove(record);
            }
            else if( record.type == 'click' ){
                this._render_click(record);
            }
        };
        proto._render_mousemove = function(record){
            this.context.beginPath();
            this.context.strokeStyle = "rgba(0,0,255,1)";
            this.context.fillStyle   = "rgba(0,0,255,0.2)";
            this.context.arc(record.x , record.y, 5, Math.PI*2, false);
            this.context.stroke();
            this.context.fill();
        }
        proto._render_click = function(record){
            this.context.beginPath();
            this.context.strokeStyle = "rgba(0,0,255,1)";
            this.context.fillStyle   = "rgba(0,0,255,0.2)";
            this.context.arc(record.x , record.y, 30, Math.PI*2, false);
            this.context.stroke();
            this.context.fill();
        }
    }(Renderer.prototype));

    /* --- Export --------- */
    (function(){
        var trace_log;
        var recorder = function(e){ trace_log.addRecord(e); };
        var canvas;
        /* Main API */
        ns.record = function(callback){
            trace_log  = new TraceLog( Utils.current_time() );
            document.body.addEventListener("mousemove",recorder, true );
            document.body.addEventListener("click", recorder, true);
            if( canvas ){ canvas.width = canvas.width + 1; canvas.display = "none"; }
            if( callback ){ callback(); }
        };
        ns.stop = function(callback){
            document.body.removeEventListener("mousemove", recorder, true);
            document.body.removeEventListener("click", recorder, true);
            if( callback ){ callback(); }
            return trace_log;
        }
        ns.replay = function(trace_log,callback){
            canvas = HtmlHeplers.overlayCanvas();
            var replayer = new Replayer(trace_log);
            replayer.play( canvas, callback );
        };
        /* Control Panel */
    }());

}());

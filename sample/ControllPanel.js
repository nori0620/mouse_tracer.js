var main_api = com.nori0620.mouse_tracer;
com.nori0620.mouse_tracer_control_panel = {};
var ns = com.nori0620.mouse_tracer_control_panel;

/*global document window */
(function(){
    /* --- ControllPanel --------- */
    var ControllPanel = {
        renderBox : function(){
            this.box = document.createElement('div');
            this.box.style.background = "#FFF";
            this.box.style.border     = "3px solid #F00";
            this.box.style.position   = 'absolute';
            this.box.style.top        = 0;
            this.box.style.right      = 0;
            this.box.style.zIndex     = 9999999;
            var that = this;
            document.body.appendChild(this.box);
            return this.box;
        },
        renderRecordButton: function(){
            this.recordButton = this.__add_button_to( this.box , 'Record' );
            var that = this;
            this.recordButton.addEventListener('click',function(){
                that.recordButton.disabled = true;
                that.stopButton.disabled = false;
                main_api.record();
            },true);
            return this.recordButton;
        },
        renderStopButton : function(){
            this.stopButton = this.__add_button_to( this.box , 'Stop' );
            this.stopButton.style.display = 'block';
            var that = this;
            this.stopButton.addEventListener('click',function(){
                that.replayButton.disabled = false;
                that.stopButton.disabled = true;
                that.trace_log = main_api.stop();
            },true);
            this.stopButton.disabled = true;
            return this.stopButton;
        },
        renderReplayButton : function(){
            this.replayButton = this.__add_button_to( this.box , 'Replay' );
            var that = this;
            this.replayButton.addEventListener('click',function(){
                that.replayButton.disabled = true;
                that.recordButton.disabled = true;
                main_api.replay( that.trace_log, function(){
                    that.recordButton.disabled = false;
                });
            },true);
            this.replayButton.disabled = true;
            return this.replayButton;
        },
        renderPanel: function(){
            this.renderBox();
            this.renderRecordButton();
            this.renderStopButton();
            this.renderReplayButton();
        },
        __add_button_to :function(elem,name){
            var button = document.createElement('input');
            button.type  = 'button';
            button.value = name;
            button.style.border = "2px outset buttonface";
            button.style.backgroundColor = "buttonface";
            button.style.padding = 3  + "px";
            button.style.width   = 80  + "px";
            button.style.height  = 30  + "px";
            elem.appendChild( button );
            return button;
        }
    };
    /* --- Export --------- */
    ns.load_panel = function(){
        ControllPanel.renderPanel();
    };
}());

/* Example of bookmarklet */
// <a href="javascript:( function(){
//  var script_url_root = 'http://your.domain/mouse_tracer.js/';
//  var e1 = document.createElement('script');
//  e1.setAttribute('language', 'JavaScript');
//  e1.setAttribute( 'src', script_url_root + 'src/MouseTracer.js');
//  document.body.appendChild(e1);
//
//  var e2 = document.createElement('script');
//  e2.setAttribute('language', 'JavaScript');
//  e2.setAttribute('src',script_url_root + 'sample/ControllPanel.js');
//  document.body.appendChild(e2);
//
//  e2.onload = function(){ com.nori0620.mouse_tracer_control_panel.load_panel(); }
// })() ">bookmarklet</a>

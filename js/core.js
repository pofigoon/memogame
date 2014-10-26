var axgame = function(container, config){
var _self, _config, _data, _canvas;

    _self = this;
    _config = {
        gameID: "002",
        gameName: "Memo game",

        delay: 800,
        showAllOnStart: 1000, // TODO: show all cards open on start for XXXX milliseconds
        timeLimit: 0, // TODO : time limit (seconds)
        rows: 0, // TODO: force rows amount (0=auto)
        cols: 0, //TODO: force columns amount (0=auto)
//        _debug: true,

        /* library of available cards */
        lib: [
           "img/1.png",
            "img/2.png",
            "img/3.png",
            "img/4.png",
            "img/5.png",
            "img/6.png",
            "img/7.png",
            "img/8.png",
            "img/9.png",
            "img/10.png",
            "img/11.png",
            "img/12.png"
        ]

    };

    _data = {
        timer:0,
        moves :0,
    };

    _tpl = {
        card: ' <div class="card" id="card-{CARD_ID}" data-id="{ID}">\
                <div class="flipper">\
                    <div class="front">\
{FRONT}\
                    </div>\
                    <div class="back" style="background: url({BACK}) no-repeat;">\
                    </div>\
                </div>\
            </div>'
    };

     this.init = function(container) {
        if ( validateMe(container) ){
            buildCanvas(container);
            _self.navigate("home");
        }
    };

    this.navigate = function(dest){
        if(dest=="win"){
            $(".axgame .axwin p span:first").text(gameTimer.get());
             $(".axgame .axwin p span:nth-of-type(2)").text(_data.moves);
        }
        _canvas.attr("data-screen", dest);
    };

    this.startGame = function() {
        buildPlay();
        if(_config.showAllOnStart){
          $(".axgame .axplay .card").addClass("flip");
            this.navigate("play");
            setTimeout(function(){
             $(".axgame .axplay .card").removeClass("flip");
                initActions();
            },_config.showAllOnStart);
        }else{
            this.navigate("play");
             initActions();
        }
    };

    this.stopGame = function(){
        killActions();
        resetCanvas();
    };

   initActions =  function(){
       /* init timer */
       gameTimer.start();

       $(".axgame .axplay .card").click(function(){
           /* increase moves counter */
           _data.moves ++;


           if(!$(this).hasClass("flipped")){
               if(!_data['currentItem']){
                   // put my id in memory
                   _data['currentItem'] = [$(this).attr("data-id"),this.id];
               }else{
                   // compare memory with my id
                   if(_data['currentItem'][0] == $(this).attr("data-id") && this.id!=_data['currentItem'][1]){
                       // open them both
                       $(".axgame .axplay .card[data-id="+_data['currentItem'][0]+"]").addClass("flipped");

                       // check if all items already flipped
                       if($(".axgame .axplay .card").length ==  $(".axgame .axplay .card.flipped").length){

                           setTimeout(function(){
                           _self.navigate("win");
                            _self.stopGame();}, 1000);

                       }
                   }else{
                       // close them both
                    setTimeout(function(){
                        $(".axgame .axplay .card:not(.flipped)").removeClass("flip");},_config.delay);
                   }
                     _data['currentItem']  = null;
               }
               $(this).toggleClass("flip");
            }
           });
   };


     gameTimer = {
        reset: function(){
            gameTimer.stop();
            _data.timer = 0;
        },
        start: function(){
          _data['timerObj'] = window.setInterval(function(){
              _data.timer++;
              if(_config._debug){
                  console.log("timer: "+_data.timer);
              }
          },1000);
        },
        stop: function(){
            window.clearInterval(_data['timerObj']);
        },
        get: function(){
                // get time from timer
                return _data.timer;
        }
     };

    killActions = function(){
        gameTimer.stop();
        gameTimer.reset();
       $(".axgame .axplay .card").unbind();
    };

    resetCanvas = function(){
         $(".axgame .axplay .card").remove();
         _data.moves  = 0;
        gameTimer.stop();
    };

    validateMe= function(container){
       if(container && container['length'] ){
            /* TODO: check for LIB & TPL */
            return $("template#axcontainer") && $("template#axui");
        }
        dropError("Incorrect container selected!");
        return false;
    };

    buildCanvas = function(container) {
        container.append($("template#axcontainer").html());
        _canvas = container.find(".axgame").append($("template#axui").html());
        _player = _canvas.find(".player");

    };

    buildPlay = function(){
        resetCanvas();
        var cardsArray = [];
        var l = _config.lib.length;
        var cnt = 0;

        /* build playground */
        $.each(_config.lib, function(i,e){
            cardsArray[i] = [e, "itm-"+i];
            cardsArray[i + l] = [e, "itm-"+i];
        });

        //shuffle array
        cardsArray  = cardsArray.sort(function() { return 0.5 - Math.random() });

        $.each(cardsArray, function(i, e){
            cnt++;
            _canvas.find(".axplay .container").append(_tpl.card.replace(/{ID}/g,e[1]).replace(/{BACK}/g, e[0]).replace(/{FRONT}/g, (_config._debug ? e[1] : "")).replace("{CARD_ID}", cnt));
        });}

    dropError = function(msg){
            console.lerror(msg);
    };


    _self.init(container);
    _config = $.extend(_config, config);
    return this;
}

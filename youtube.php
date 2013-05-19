<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->

        <!-- Add your site or application content here -->
        <p>Hello world! This is HTML5 Boilerplate.</p>

        <!-- <iframe width="560" height="315" src="http://www.youtube.com/embed/g5vVRcP5sUI" frameborder="0" allowfullscreen></iframe>       -->
        <style type="text/css">
            .skin{  background: yellow; width: 200px; height: 200px; }

        </style>
        <div class="skin"></div>
    <div id="player"></div>

    <script>
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: 'g5vVRcP5sUI',
          playerVars: { 
              'wmode': 'opaque', // To send Youtube behind
              'controls' : 0 },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {        
        $('.skin').click(function(){
            player.playVideo();            
        });
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var lastStateChange;
      function onPlayerStateChange(event) { 
        lastStateChange = event.data;       
        switch( event.data ){
            case -1:
                console.log( 'State event unstarted', event.data );
                break;
            case 0:
                console.log( 'State event ended', event.data );
                $('.skin').css('background', 'red');       
                break;
            case 1:
                console.log( 'State event playing', event.data );
                 $('.skin').css('background', 'green');
                break;
            case 2:
                console.log( 'State event paused', event.data );
                pauseVideo();
                break;
            case 3:
                console.log( 'State event buffering', event.data );
                //bufferVideo();
                break;
            case 5:
                console.log( 'State event video cued', event.data );
                break;
        }
        console.log( 'last state ', lastStateChange );
        // if (event.data == YT.PlayerState.PLAYING ) {
           
        // }else if( event.data == YT.PlayerState.PAUSED ){
        //     pauseVideo();
        // }else if( event.data == YT.PlayerState.ENDED ){
                    
        // }else if( event.data)    
      }

      function stopVideo() {
        player.stopVideo();
      }

      function pauseVideo() {       
        setTimeout(function(){
            if( lastStateChange == 2 ){
                $('.skin').css('background', 'orange');
                player.pauseVideo();
            }
        }, 1000);
      }

      function bufferVideo(){
        bufferInterval = setInterval(function(){
            if( lastStateChange == 3 ){
                console.log( 'ask play');
                $('.skin').css('background', 'orange');
                player.playVideo();
            }else{
                clearInterval( bufferInterval );
            }
        }, 1000); 
      }
    </script>



        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.2.min.js"><\/script>')</script>
        

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>
    </body>
</html>

<?php

    function get_server_time(){
        date_default_timezone_set('America/New_York');
        $currenttime = date('h:i:s:u');
        list($hrs,$mins,$secs,$msecs) = explode(':',$currenttime);
        return "$hrs:$mins:$secs";    
    }

?>
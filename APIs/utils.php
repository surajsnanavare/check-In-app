<?php
    /*
    * Author      : Suraj Nanavare
    * Created At  : 04th August 2019
    * Description : This is a file which stores a reusable and utility functions.
    * Email ID    : surajsnanavare@gmail.com
    */

    function get_server_time(){
        date_default_timezone_set('America/New_York');
        $currenttime = date('h:i:s:u');
        list($hrs,$mins,$secs,$msecs) = split(':',$currenttime);
        return "$hrs:$mins:$secs";    
    }

?>
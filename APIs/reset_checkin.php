<?php

    try{
        $file_name = $_GET['f'];
        $name = $_GET['name'];
        $checkin_time = $_GET['checkin_time'];
        $file_path = "../data/".$file_name;

        $requested_name = explode(" ",$name);
        $requested_lname = $requested_name[0];
        $requested_fname = $requested_name[1];
        $raw_string = "";

        $fn = fopen($file_path,"r");
        while(! feof($fn))  {
            $result = fgets($fn);
            $name = explode(",",$result);
            if($result){
                $lname = $name[0];
                $fname = trim($name[1],"\n");
                $name_details = array("fname"=>$fname,"lname"=>$lname[1]);
                if(isset($fname) && isset($lname)){
                    // echo trim($fname),$requested_fname;
                    if(trim($lname) == trim($requested_lname) && trim($fname) == trim($requested_fname)){
                        $entry_with_checkin_time = $name[0].",".$fname."\n";
                        $raw_string = $raw_string.$entry_with_checkin_time;
                    }
                    else{
                        $raw_string = $raw_string.$result;
                    }
                }
            }
        }
        fclose($fn);
        // echo $raw_string;
        $newfile = fopen($file_path, "w") or die("Unable to open file!");
        fwrite($newfile,$raw_string);
        fclose($newfile);
        echo "1";
    }catch(Exception $e){
        echo "Checkin Failed!";
    }
?>
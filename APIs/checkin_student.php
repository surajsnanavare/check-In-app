<!--
 * Author      : Suraj Nanavare
 * Created At  : 19th July 2019
 * Description : This API marks check-In time of student. It read records one by one 
                 from file and add timestamp for the record who's 1st name and last name
                 is exactly matched with suppiled record by user.
 * Email ID    : surajsnanavare@gmail.com
 *-->

<?php

    try{
        /* Read parameters f: Project name, name: name of student, and checkin time. */
        $file_name = $_GET['f'];
        $name = $_GET['name'];
        $checkin_time = $_GET['checkin_time'];
        $file_path = "../data/".$file_name;

        /* Extract first name and last name from the name. Instantiate raw string to hold 
          updated file stream. */
        $requested_name = explode(" ",$name);
        $requested_lname = $requested_name[0];
        $requested_fname = $requested_name[1];
        $raw_string = "";

        /* Read file and update timestamp for given student and update in raw string. */
        $fn = fopen($file_path,"r");
        while(! feof($fn))  {
            $result = fgets($fn);
            $name = explode(",",$result);
            if($result){
                $lname = $name[0];
                $fname = trim($name[1],"\n");
                $name_details = array("fname"=>$fname,"lname"=>$lname[1]);
                if(isset($fname) && isset($lname)){
                    if(trim($lname) == trim($requested_lname) && trim($fname) == trim($requested_fname)){
                        $entry_with_checkin_time = $name[0].",".$fname.",".$checkin_time."\n";
                        $raw_string = $raw_string.$entry_with_checkin_time;
                    }
                    else{
                        $raw_string = $raw_string.$result;
                    }
                }
            }
        }
        fclose($fn);

        /* Write updated raw tring back into file. */
        $newfile = fopen($file_path, "w") or die("Unable to open file!");
        fwrite($newfile,$raw_string);
        fclose($newfile);
        echo $checkin_time;
    }catch(Exception $e){
        echo "Checkin Failed!";
    }
?>
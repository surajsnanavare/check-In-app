<?php

    include_once 'utils.php';
    try{
        /* Read parameters f: Project name, name: name of student, and checkin time. */
        $file_name = $_GET['f'];
        $requested_roll_no = $_GET['roll_no'];
        $checkin_time = get_server_time();
        $file_path = "../data/".$file_name;

        /* Instantiate raw string to hold updated file stream. */
        $raw_string = "";

        /* Read file and update timestamp for given student and update in raw string. */
        $fn = fopen($file_path,"r");
        while(! feof($fn))  {
            $result = fgets($fn);
            if($result){
                $student_details = explode(";",$result);
                $roll_no = $student_details[0];
                $lname = $student_details[1];
                $fname = $student_details[2];
                $timestamp = $student_details[3];

                if($roll_no == $requested_roll_no && !isset($timstamp)){
                    $entry_with_checkin_time = $roll_no.";".$lname.";".$fname.";".$checkin_time."\n";//add timestamp into file                        
                    $raw_string              = $raw_string.$entry_with_checkin_time;
                }else{
                    $raw_string = $raw_string.$result;
                }
            }
        }
        fclose($fn);

        /* Write updated raw tring back into file. */
        $newfile = fopen($file_path, "w") or die("Unable to update!");
        fwrite($newfile,$raw_string);
        fclose($newfile);
        echo $checkin_time;
    }catch(Exception $e){
        echo "Update Failed!";
    }
?>
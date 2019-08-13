<?php

  
    try {
        /* Read parameters f : project filename, name: name of student and reset_all Parameter. */
        $file_name = $_GET['f'];
        $requested_roll_no = $_GET['roll_no'];
        $reset_all = $_GET['reset_all'];
        $file_path = "../data/" . $file_name;
        
        /* Instantiate raw_string to hold updated file contnets. */
        $raw_string = "";
        
        /* Read file line by line and update timestamp and build updated raw string. */
        $fn = fopen($file_path, "r");
        while (!feof($fn)) {
            $result = fgets($fn);
            if($result){
                $student_details = explode(";",$result);
                $roll_no = $student_details[0];
                $lname = $student_details[1];
                $fname = $student_details[2];
                $timestamp = $student_details[3];

                if (isset($roll_no)) {
                    if ( $roll_no == $requested_roll_no || $reset_all == 1) {  //JS function calls with flag of 0 for one student OR 1 for all students
                        $entry_without_checkin_time = $roll_no.";".$lname.";".$fname.";"."\n";
                        $raw_string                 = $raw_string.$entry_without_checkin_time;
                    } else {
                        $raw_string = $raw_string . $result;
                    }
                }

            }
        }
        fclose($fn);
        
        /* Write updated file content from raw_string into file. */
        $newfile = fopen($file_path, "w") or die("Unable to update!");
        fwrite($newfile, $raw_string);
        fclose($newfile);
        echo "1";
    }
    catch (Exception $e) {
        echo "Checkin Failed!";
    }
?>
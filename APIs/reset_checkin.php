<!--
 * Author      : Suraj Nanavare
 * Created At  : 19th July 2019
 * Description : This is API to "Reset" checkIn for indivisual student and "Reset All"
 *               to rest check-ins for all students at a time. 
 * Email ID    : surajsnanavare@gmail.com
 *-->

<?php
 
 try {
    /* Read parameters f : project filename, name: name of student and reset_all Parameter. */
     $file_name = $_GET['f'];
     $name      = $_GET['name'];
     $reset_all = $_GET['reset_all'];
     $file_path = "../data/" . $file_name;
     
    /* Split name into firstname and lastname and instantiate raw_string 
     to hold updated file contnets. */
     $requested_name  = explode(" ", $name);
     $requested_lname = $requested_name[0];
     $requested_fname = $requested_name[1];
     $raw_string      = "";
     
     /* Read file line by line and update timestamp and build updated raw string. */
     $fn = fopen($file_path, "r");
     while (!feof($fn)) {
         $result = fgets($fn);
         $name   = explode(",", $result);
         if ($result) {
             $lname        = $name[0];
             $fname        = trim($name[1], "\n");
             $name_details = array(
                 "fname" => $fname,
                 "lname" => $lname[1]
             );
             if (isset($fname) && isset($lname)) {
                 if (trim($lname) == trim($requested_lname) && trim($fname) == trim($requested_fname) || $reset_all == 1) {
                     $entry_with_checkin_time = $name[0] . "," . $fname . "\n";
                     $raw_string              = $raw_string . $entry_with_checkin_time;
                 } else {
                     $raw_string = $raw_string . $result;
                 }
             }
         }
     }
     fclose($fn);
     
     /* Write updated file content from raw_string into file. */
     $newfile = fopen($file_path, "w") or die("Unable to open file!");
     fwrite($newfile, $raw_string);
     fclose($newfile);
     echo "1";
 }
 catch (Exception $e) {
     echo "Checkin Failed!";
 }
?>
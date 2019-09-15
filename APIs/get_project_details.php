<?php

    try{
        /** Read parameter f: project file name and create fill path for specified file. */
        $file_name = $_GET['f'];
        $is_report = $_GET['is_report'];
        $file_path = "../data/".$file_name;
        $PRIVACY_MODE = 1; // PRIVACY_MODE = 0 shows both first name and last name in report and PRIVACY_MODE = 1 shows only first name
        
        /** Read lastname and firstname from file  and array of objects for student names.*/
        $students = array();
        $fn = fopen($file_path,"r");
        while(! feof($fn))  {
            $result = fgets($fn);
            if($result){
                $student_details = explode(";",$result);
                $roll_no   = $student_details[0];
                $lname     = $student_details[1];
                $fname     = $student_details[2];
                $timestamp = $student_details[3];
                
                // If first name and last name is not available, then display '-NA-' else show whichever(firstname/lastname) is available.
                $name = $lname . ' ' . $fname;
                if(empty($fname) && empty($lname)){
                    $name = '-NA-';
                }
                // If page is 'Report' and PRIVACY_MODE is '1' then only show first name else show whichever(firstname/lastname) is available.
                else if($is_report=="1" && $PRIVACY_MODE == 1){
                    if(!empty($fname))
                        $name = $fname;
                    else
                        $name = $lname;
                }

                $student_details_array = array("roll_no"=>$roll_no,"name"=>$name,"timestamp"=>$timestamp);

                if(isset($roll_no)){
                    array_push($students,$student_details_array);
                }
            }
        }
        fclose($fn);

        /** Extract project name and date from the filename provided as GET parameter. */
        $project_name = trim($file_name);
        $date = "";

        /** Create a JSON object containing project info and student names with timestamp. */
        $project_details = '{"project_name" : "'.$project_name.'", "date" : "'.$date.'", "students":'.json_encode($students).'}';
        echo json_encode($project_details);
    }catch(Exception $e){
        echo "Technical Problem Occured!";   
    }
?>
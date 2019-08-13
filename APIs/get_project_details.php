<?php

    try{
        /** Read parameter f: project file name and create fill path for specified file. */
        $file_name = $_GET['f'];
        $role = $_GET['role'];
        $file_path = "../data/".$file_name;
        $PRIVACY_MODE = 0;
        
        /** Read lastname and firstname from file  and array of objects for student names.*/
        $students = array();
        $fn = fopen($file_path,"r");
        while(! feof($fn))  {
            $result = fgets($fn);
            if($result){
                $student_details = explode(";",$result);
                $roll_no = $student_details[0];
                $lname = $student_details[1];
                $fname = $student_details[2];
                $timestamp = $student_details[3];
                // if(trim($role)=='CO'){
                    
                //     $student_details_array = array("roll_no"=>trim($roll_no),"lname"=>trim($lname),"fname"=>trim($fname),"timestamp"=>trim($timestamp));
                // }
                // else
                if(trim($role)=='SU' && $PRIVACY_MODE == 1){
                    $student_details_array = array("roll_no"=>trim($roll_no),"fname"=>trim($fname),"timestamp"=>trim($timestamp));
                }
                else{
                    $student_details_array = array("roll_no"=>trim($roll_no),"lname"=>trim($lname),"fname"=>trim($fname),"timestamp"=>trim($timestamp));
                }

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
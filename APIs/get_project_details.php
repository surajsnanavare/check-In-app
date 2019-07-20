<!--
 * Author      : Suraj Nanavare
 * Created At  : 19th July 2019
 * Description : This API fetch details of give projects (i.e Project Name & Date)
 *               and list of students to be checked-In. This API returns output in
 *               JSON format.
 * Email ID    : surajsnanavare@gmail.com
 *-->

<?php
 try{
     /** Read parameter f: project file name and create fill path for specified file. */
     $file_name = $_GET['f'];
     $file_path = "../data/".$file_name;

     /** Read lastname and firstname from file  and array of objects for student names.*/
     $students = array();
     $fn = fopen($file_path,"r");
     while(! feof($fn))  {
         $result = fgets($fn);
         $name = explode(",",$result);
         if($result){
             $name_details = array("fname"=>$name[1],"lname"=>trim($name[0], "\n"),"timestamp"=>$name[2]);
             $lname = $name[1];
             if(isset($name[0]) && isset($lname)){
                 array_push($students,$name_details);
             }
         }
     }
     fclose($fn);

     /** Extract project name and date from the filename provided as GET parameter. */
     $project_name = explode("_",$file_name)[0];
     $date = explode(".txt",explode("_",$file_name)[1])[0];

     /** Create a JSON object containing project info and student names with timestamp. */
     $project_details = '{ "project_name" : "'.$project_name.'", "date" : "'.$date.'", "students":'.json_encode($students).'}';
     echo json_encode($project_details);
 }
 catch(Exception $e){
    echo "Technical Problem Occured!";   
 }
?>
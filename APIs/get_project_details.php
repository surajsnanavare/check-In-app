<?php
    try{
        $file_name = $_GET['f'];
        $file_path = "../data/".$file_name;

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

        $project_name = explode("_",$file_name)[0];
        $date = explode(".txt",explode("_",$file_name)[1])[0];

        $project_details = '{ "project_name" : "'.$project_name.'", "date" : "'.$date.'", "students":'.json_encode($students).'}';
        echo json_encode($project_details);
    }catch(Exception $e){
        echo "Technical Problem Occured!";   
    }
?>
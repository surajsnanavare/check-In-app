<?php
    include 'connection.php';

    if(isset($_GET['name'])){
        $sql = "INSERT INTO `projects` (`project_name`) VALUES ('". $_GET['name']."');";

        if ($conn->query($sql) === TRUE) {
            echo "Project Added Successfully!";
        } else {
            echo $conn->error;
            // echo "Project Not Added!";
        }
    }    
    $conn->close();
?>
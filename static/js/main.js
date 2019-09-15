 
/** Configuration Contants **/
// determines the PHP script that is being called from this JS script 
PROJECT_DETAILS_ENDPOINT = "APIs/get_project_details.php";
CHECKIN_API_ENDPOINT = "APIs/checkin_student.php";
RESET_CHECKIN_API_ENDPOINT = "APIs/reset_checkin.php";
TOTAL_PAGES = 1;
PER_PAGE_RECORDS = 100;

/** List of Events
    --------------
    get_current_time: gets client device timestamp
    get_project_details: takes details from text server file and populates into html page -> calls PHP script to get details 
    checkin_student: checks student in -> calls PHP script to update file with timestamp
    reset_checkin: reset check-in for one student (UNDO button) -> calls PHP script to update file to remove timestamp
    reset_all_checkins: reset check-in for all student -> calls PHP script to update file and remove all timestamps
    pagination: navigation between pages
    navigate_page(direction): changes page depending on action called - back or next
**/

/** Function to get project & respective student details for teh initial load of the page -> page initial load/refresh and Reset **/
function get_project_details(obj) {
    var url = new URL(window.location.href); // Gets URL 
    var project_name = url.searchParams.get('f'); //Find info in parameter 'f' i.e "robotic_19-07-2021.txt"

    //Flag to identify Report ( 1 ) or Coordinator ( 0 ) 
    if (url.pathname.indexOf('/report') >= 0) {
        is_report = 1;
    } else {
        is_report = 0;
    };
    
    var query_string = "?f=" + project_name + "&is_report=" + is_report;
   
    //AJAX API calls to PHP script 
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var project_details = JSON.parse(JSON.parse(this.responseText));
            document.getElementById('project_name').innerText = project_details.project_name.toUpperCase();  //calls project_details() from get_project_details.php  
            document.getElementById('date').innerText = project_details.date;

            //Fills in student list on page 
            students = project_details.students;
            student_list = "";
            TOTAL_PAGES = Math.ceil(students.length / PER_PAGE_RECORDS);
            document.getElementById("total_pages").value = TOTAL_PAGES;

            //List students on to the page 
            for (i = 0; i < students.length; i++) {
                // lname = students[i].lname.trim();
                // fname = students[i].fname.trim();
                roll_no = students[i].roll_no.trim();
                timestamp = students[i].timestamp.trim();
                name = students[i].name;

                if (is_report == 0) {     //Coordinator page (is_report == 0)                    
                    //If the student is checked-in 
                    if (timestamp) {
                        student = '<tr class="record">\
                                        <td class="name-td" id="name_' + roll_no + '">' + name + '</td> \
                                        <td class="action-td"> \
                                            <button class="btn btn-small btn-teal p10" id="checkin_' + roll_no + '" onclick="checkin_student(this)" disabled>' + timestamp + '</button> \
                                        </td><td>\
                                            <button class="btn btn-small btn-teal p10" id="reset_' + roll_no + '" onclick="reset_checkin(this)"><img src="undo.png" width="10px"></button> \
                                        </td>\
                                    </tr>';
                    } 

                    //If the student is not checked-in 
                    else {
                        student = '<tr class="record">\
                                        <td class="name-td" id="name_' + roll_no + '">' + name + '</td> \
                                        <td class="action-td"> \
                                            <button class="btn btn-small btn-teal p10" id="checkin_' + roll_no + '" onclick="checkin_student(this)" style="width:73px;">Arrived</button> \
                                        </td><td>\
                                            <button  class="btn btn-small btn-teal p10" id="reset_' + roll_no + '" onclick="reset_checkin(this)" disabled><img src="undo.png" width="10px"></button> \
                                        </td>\
                                </tr>';
                    }
                } 
                
                //This is for Report page i.e. (is_report == 1)  
                else {
                    
                    //If the student is checked-in 
                    
                    if (timestamp) {
                        student = '<tr class="record">\
                                        <td class="name-td" id="name_' + roll_no + '">' + name + '</td> \
                                        <td>\
                                            <td class="action-td p10" style="background: #009688;color: white;">' + timestamp + '</td>\
                                        </td>\
                                    </tr>';
                    } 

                    //If the student is not checked-in 
                    else {
                        student = '<tr class="record">\
                                        <td class="name-td" id="name_' + roll_no + '">' + name + '</td> \
                                        <td>\
                                            <td class="action-td p10" style="background:#ff010187"> Not Arrived </td>\
                                        </td>\
                                    </tr>';
                    }

                }
                student_list = student_list + student;
            }
            if (student_list) {
                document.getElementById('student_list').innerHTML = student_list;
            } else {
                document.getElementById('student_list').innerHTML = "<tr><td>No Students</td></tr>";
            }
            // pagination();
        }
    };

    xmlhttp.open("GET", PROJECT_DETAILS_ENDPOINT + query_string, true);
    xmlhttp.send();
}

/** Function to add time of checking in of student into file **/
function checkin_student(obj) {
    var roll_no = obj.id.split("_")[1];
    var url = new URL(window.location.href);
    var project_name = url.searchParams.get('f');

    var query_string = "?f=" + project_name + "&roll_no=" + roll_no; //name is name_of_student

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText.split(":").length == 3) {
                document.getElementById('checkin_' + roll_no).innerText = this.responseText;   //update checkin time for student on the Index.html 
                document.getElementById('checkin_' + roll_no).setAttribute('disabled', 'disabled'); //disables check_in button              
                document.getElementById('reset_' + roll_no).removeAttribute('disabled'); //re-enables check_in button
            } else {
                alert(this.responseText);
            }
        }
    };
    xmlhttp.open("GET", CHECKIN_API_ENDPOINT + query_string, true);
    xmlhttp.send();
}

/** Function to reset checkIn time of indivisual student **/
function reset_checkin(obj) {
    var roll_no = obj.id.split("_")[1];
    var url = new URL(window.location.href);
    var project_name = url.searchParams.get('f');

    var query_string = "?f=" + project_name + "&roll_no=" + roll_no + "&reset_all=0";

    // processes the data coming from API
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "1") {
                document.getElementById('checkin_' + roll_no).innerText = "Arrived";
                document.getElementById('checkin_' + roll_no).removeAttribute('disabled');
                document.getElementById('reset_' + roll_no).setAttribute('disabled', 'disabled');
                document.getElementById('reset_' + roll_no).setAttribute('style', 'width:73%');

            } else {
                alert(this.responseText);
            }
        }
    };

    // Sends Undo command to PHP 
    xmlhttp.open("GET", RESET_CHECKIN_API_ENDPOINT + query_string, true);
    xmlhttp.send();
}

/** Function to reset checkIn time of  all students **/
function reset_all_checkins() {
    if (confirm("Do you really want to reset all?")) {
        var url = new URL(window.location.href);
        var project_name = url.searchParams.get('f');

        var query_string = "?f=" + project_name + "&name=" + name + "&reset_all=1";
        var xmlhttp = new XMLHttpRequest();

        // processes the data coming from API
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText == "1") {
                    location.reload();
                } else {
                    alert(this.responseText);
                }
            }
        };
        
        // Sends reset command to PHP 
        xmlhttp.open("GET", RESET_CHECKIN_API_ENDPOINT + query_string, true);
        xmlhttp.send();
    }
}


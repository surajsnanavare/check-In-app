 
/** Configuration Contants **/
// determines the PHP script that is being called from this JS script 
PROJECT_DETAILS_ENDPOINT = "APIs/get_project_details.php?f=";
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
function get_project_details() {
    var url = new URL(window.location.href); // Gets URL 
    var project_name = url.searchParams.get('f'); //Find info in parameter 'f' i.e "robotic_19-07-2021.txt"

    //Flag to identify Report ( 1 ) or Coordinator ( 0 ) 
    if (url.pathname.indexOf('/report') >= 0) {
        is_report = 1
    } else {
        is_report = 0
    };

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
                name = students[i].lname.trim() + ' ' + students[i].fname.trim();
                roll_no = students[i].roll_no.trim();
                timestamp = students[i].timestamp;

                if (is_report == 0) {       //Coordinator page (is_report == 0)

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
                                    <td class="action-td" style="display:contents"> \
                                        <button class="btn btn-small btn-teal p10" id="checkin_' + roll_no + '" onclick="checkin_student(this)">Arrived</button> \
                                    </td><td>\
                                        <button  class="btn btn-small btn-teal p10" id="reset_' + roll_no + '" onclick="reset_checkin(this)" disabled><img src="undo.png" width="10px"></button> \
                                    </td>\
                                </tr>';
                    }
                } 
                
                //This is for Report page i.e. (is_report == 1)  
                else {
                    //If student is not checked in 
                    if (timestamp == null || timestamp == "undefined") {
                        timestamp = "Not Arrived";
                    }
                    //If student is checked in 
                    student = '<tr class="record">\
                                <td class="name-td">' + name + '</td>\
                                <td class="action-td p10">' + timestamp + '</td>\
                            </tr>';
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

    xmlhttp.open("GET", PROJECT_DETAILS_ENDPOINT + project_name, true);
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

// /** Function for pagination **/
// function pagination() {
//     var curr_page = document.getElementById("current_page").value;
//     var total_pages = document.getElementById("total_pages").value;
//     var records = document.getElementsByClassName('record');

//     if (curr_page == 1) {
//         document.getElementById("prev_button").setAttribute('disabled', 'disabled');

//     } else {
//         document.getElementById("prev_button").removeAttribute('disabled');
//     }

//     if (curr_page == total_pages) {
//         document.getElementById("next_button").setAttribute('disabled', 'disabled');
//     } else {
//         document.getElementById("next_button").removeAttribute('disabled');
//     }

//     document.getElementById("current_page_label").innerText = curr_page;
//     document.getElementById("total_pages_label").innerText = total_pages;

//     for (record = 0; record < records.length; record++) {
//         if (record < (curr_page * PER_PAGE_RECORDS) && record >= (curr_page * PER_PAGE_RECORDS) - PER_PAGE_RECORDS) {
//             records[record].style.display = "";
//         } else {
//             records[record].style.display = "none";
//         }
//     }
// }

// /** Function to navigate Back and Forth in records in pagination **/
// function navigate_page(direction) {
//     var curr_page = document.getElementById("current_page");
//     var total_pages = document.getElementById("total_pages").value;
//     curr_page_value = curr_page.value;
//     if (direction == "Next") {
//         next_page = Number(curr_page_value) + Number(1);
//     } else if (direction == "Prev") {
//         next_page = Number(curr_page_value) - Number(1);
//     }
//     curr_page.value = next_page;
//     pagination();
// }

// /** Function to get current time for Check-In **/
// function get_current_time() {
//     var date = new Date();
//     var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
//     var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
//     var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
//     time = hours + ":" + minutes + ":" + seconds;
//     return time;
// };


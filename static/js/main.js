PROJECT_DETAILS_ENDPOINT = "APIs/get_project_details.php?f=";
CHECKIN_API_ENDPOINT = "APIs/checkin_student.php";
RESET_CHECKIN_API_ENDPOINT = "APIs/reset_checkin.php";
TOTAL_PAGES = 1;
PER_PAGE_RECORDS = 7;

/*** Function to get current time for Check-In ***/
function get_current_time() {
    var date = new Date();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    time = hours + ":" + minutes + ":" + seconds;
    return time;
};

/*** Function for pagination ***/
function pagination() {
    var curr_page = document.getElementById("current_page").value;
    var total_pages = document.getElementById("total_pages").value;
    var records = document.getElementsByClassName('record');
    
    if (curr_page == 1) {
        document.getElementById("prev_button").setAttribute('disabled', 'disabled');

    } else {
        document.getElementById("prev_button").removeAttribute('disabled');
    }

    if (curr_page == total_pages) {
        document.getElementById("next_button").setAttribute('disabled', 'disabled');
    } else {
        document.getElementById("next_button").removeAttribute('disabled');
    }

    document.getElementById("current_page_label").innerText = curr_page;
    document.getElementById("total_pages_label").innerText = total_pages;

    for (record = 0; record < records.length; record++) {
        if (record < (curr_page * PER_PAGE_RECORDS) && record >= (curr_page * PER_PAGE_RECORDS) - PER_PAGE_RECORDS) {
            records[record].style.display = "";
        } else {
            records[record].style.display = "none";
        }
    }
}

/*** Function to navigate Back and Forth in records in pagination ***/
function navigate_page(direction) {
    var curr_page = document.getElementById("current_page");
    var total_pages = document.getElementById("total_pages").value;
    curr_page_value = curr_page.value;
    if (direction == "Next") {
        next_page = Number(curr_page_value) + Number(1);
    } else if (direction == "Prev") {
        next_page = Number(curr_page_value) - Number(1);
    }
    curr_page.value = next_page;
    pagination();
}

/*** Function to get project & respective student details with checkIn and Reset button ***/
function get_project_details() {
    var url = new URL(window.location.href);
    var project_name = url.searchParams.get('f');

    if (url.pathname.indexOf('/report') >= 0) {
        is_report = 1
    } else {
        is_report = 0
    };

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var project_details = JSON.parse(JSON.parse(this.responseText));
            document.getElementById('project_name').innerText = project_details.project_name.toUpperCase();
            document.getElementById('date').innerText = project_details.date;

            students = project_details.students;
            student_list = "";
            TOTAL_PAGES = Math.ceil(students.length / PER_PAGE_RECORDS);
            document.getElementById("total_pages").value = TOTAL_PAGES;
            for (i = 0; i < students.length; i++) {
                name = students[i].lname.trim() + ' ' + students[i].fname.trim();
                timestamp = students[i].timestamp;
                if (is_report == 0) {
                    if (timestamp) {
                        student = '<tr class="record">\
                                    <td class="name-td" id="name_' + i + '">' + name + '</td> \
                                    <td class="action-td"> \
                                        <button class="btn btn-small btn-teal p10" id="checkin_' + i + '" onclick="checkin_student(this)" disabled>' + timestamp + '</button> \
                                        <button  class="btn btn-small btn-teal p10" id="reset_' + i + '" onclick="reset_checkin(this)"><img src="checkinapp/../static/icons/undo.png" width="10px"></button> \
                                    </td>\
                                </tr>';
                    } else {
                        student = '<tr class="record">\
                                    <td class="name-td" id="name_' + i + '">' + name + '</td> \
                                    <td class="action-td"> \
                                        <button class="btn btn-small btn-teal p10" id="checkin_' + i + '" onclick="checkin_student(this)">Check In</button> \
                                        <button  class="btn btn-small btn-teal p10" id="reset_' + i + '" onclick="reset_checkin(this)" disabled><img src="checkinapp/../static/icons/undo.png" width="10px"></button> \
                                    </td>\
                                </tr>';
                    }
                } else {
                    if (timestamp == null || timestamp == "undefined") {
                        timestamp = "Not Checked In";
                    }
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
            pagination();
        }
    };

    xmlhttp.open("GET", PROJECT_DETAILS_ENDPOINT + project_name, true);
    xmlhttp.send();
}

/*** Function to add time of checking in file ***/
function checkin_student(obj) {
    var id_number = obj.id.split("_")[1];
    var checkin_time = get_current_time();
    var name = document.getElementById('name_' + id_number).innerText;
    var url = new URL(window.location.href);
    var project_name = url.searchParams.get('f');

    var query_string = "?f=" + project_name + "&checkin_time=" + checkin_time + "&name=" + name;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == checkin_time) {
                document.getElementById('checkin_' + id_number).innerText = checkin_time;
                document.getElementById('checkin_' + id_number).setAttribute('disabled', 'disabled');
                document.getElementById('reset_' + id_number).removeAttribute('disabled');
            } else {
                alert(this.responseText);
            }
        }
    };
    xmlhttp.open("GET", CHECKIN_API_ENDPOINT + query_string, true);
    xmlhttp.send();
}

/*** Function to reset checkIn time of indivisual student ***/
function reset_checkin(obj) {
    var id_number = obj.id.split("_")[1];
    var name = document.getElementById('name_' + id_number).innerText;
    var url = new URL(window.location.href);
    var project_name = url.searchParams.get('f');

    var query_string = "?f=" + project_name + "&name=" + name + "&reset_all=0";

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "1") {
                document.getElementById('checkin_' + id_number).innerText = "Check In";
                document.getElementById('checkin_' + id_number).removeAttribute('disabled');
                document.getElementById('reset_' + id_number).setAttribute('disabled', 'disabled');
            } else {
                alert(this.responseText);
            }
        }
    };
    xmlhttp.open("GET", RESET_CHECKIN_API_ENDPOINT + query_string, true);
    xmlhttp.send();
}

/*** Function to reset checkIn time of  all students ***/
function reset_all_checkins() {
    if (confirm("Do you really want to reset all?")) {
        var url = new URL(window.location.href);
        var project_name = url.searchParams.get('f');

        var query_string = "?f=" + project_name + "&name=" + name + "&reset_all=1";
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText == "1") {
                    location.reload();
                } else {
                    alert(this.responseText);
                }
            }
        };
        xmlhttp.open("GET", RESET_CHECKIN_API_ENDPOINT + query_string, true);
        xmlhttp.send();
    }
}
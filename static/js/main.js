// When the user clicks the button, open the modal 
function open_modal(obj){
  modal_id = obj.name;
  document.getElementById(modal_id).style.display = "block";
}

// When the user clicks on close the modal
function close_modal(obj) {
    modal_id = obj.name;
    document.getElementById(modal_id).style.display = "none";  
}

function get_current_time() {
    var date = new Date();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    time = hours + ":" + minutes + ":" + seconds;
    return time;
};

function add_new_project(obj){
    project_name =document.getElementById('new_project_name');
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        resp = this.responseText;
        project_name.value = "";
        document.getElementById('add_new_project').style.display = "None";
        alert(resp);
        location.reload();
      }
    };
    obj.innerHTML = "Please Wait...";
    xmlhttp.open("GET", "APIs/create_project.php?name=" + project_name.value, true);
    xmlhttp.send();
}


function get_project_details(){
    var url = new URL(window.location.href);
    var project_name = url.searchParams.get('f');
    
    if(url.pathname.indexOf('/report/')> 0){
        is_report = 1
    }else{
        is_report = 0
    };

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // alert(this.responseText);
        var project_details = JSON.parse(JSON.parse(this.responseText));
        document.getElementById('project_name').innerText = project_details.project_name.toUpperCase();
        document.getElementById('date').innerText  = project_details.date;
    
        students = project_details.students;
        student_list = "";
        for(i=0;i<students.length;i++){
            name = students[i].lname.trim()+ ' ' +students[i].fname.trim();
            timestamp = students[i].timestamp;
            if(is_report==0){
                if(timestamp){
                    student = '<tr>\
                                    <td class="name-td" id="name_'+i+'">'+name+'</td> \
                                    <td class="action-td"> \
                                        <button class="btn btn-small btn-teal p10" id="checkin_'+i+'">12:00:00</button> \
                                        <button  class="btn btn-small btn-teal p10" id="reset_'+i+'" onclick="reset_checkin(this)"><img src="checkinapp/../static/icons/undo.png" width="10px"></button> \
                                    </td>\
                                </tr>';
                }else{
                    student = '<tr>\
                                    <td class="name-td" id="name_'+i+'">'+name+'</td> \
                                    <td class="action-td"> \
                                        <button class="btn btn-small btn-teal p10" id="checkin_'+i+'" onclick="checkin_student(this)">Check In</button> \
                                        <button  class="btn btn-small btn-teal p10" id="reset_'+i+'"><img src="checkinapp/../static/icons/undo.png" width="10px"></button> \
                                    </td>\
                                </tr>';
                }
            }else{
                if(timestamp==null || timestamp=="undefined"){
                    timestamp = "Not Checked In";
                }
                student = '<tr>\
                                <td class="name-td">'+name+'</td>\
                                <td class="action-td p10">'+timestamp+'</td>\
                            </tr>';
            }
            student_list = student_list + student;
        }
        if(student_list){
            document.getElementById('student_list').innerHTML = student_list;
        }else{
            document.getElementById('student_list').innerHTML =  "<tr><td>No Students</td></tr>";
        }
      }
    };
    
    if(is_report>0){
        xmlhttp.open("GET", "../APIs/get_project_details.php?f=" + project_name, true);
    }else{
        xmlhttp.open("GET", "APIs/get_project_details.php?f=" + project_name, true);
    }
    xmlhttp.send();
}

function checkin_student(obj){
    var id_number = obj.id.split("_")[1];
    var checkin_time = get_current_time();
    var name = document.getElementById('name_'+id_number).innerText;
    var url = new URL(window.location.href);
    var project_name = url.searchParams.get('f');

    var query_string = "?f="+project_name+"&checkin_time=" +checkin_time + "&name=" + name;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if(this.responseText == checkin_time){
            document.getElementById('checkin_'+id_number).innerText = checkin_time;
        }else{
            alert(this.responseText);
        }
      }
    };
    xmlhttp.open("GET", "APIs/checkin_student.php"+query_string, true);
    xmlhttp.send();
}


# check-In-app
###Description:
This application enable students to be checked-in with timestamp collected. The project co-ordinator will check-in the 10-20 students based on their roll-number. The objective is to capture the start time for each student, and report it to the supervisor.


### Features

- Ability mark check-In time for every student in one click.
- Check-In time can be reverted, if time marked by mistakely.
- Reset All option to reset check-In time for all students a time.
- Responsive UI - Assessible on every device(Android/Apple/Desktop).
- Supervisor mode to see who is check-In and at what time.

### Project Directory Structure
+ check-In-app
	* APIs (PHP APIs to manipulate file data)
		* checkin_student.php
		* get_project_details.php
		* reset_checkin.php
	* data(Stores .txt file for each project with student details)
	* 	static
		+ css
			* main.css
		+ js
			* main.js
		+ icon
	* 	index.html (A webpage where project coordinator can mark check-In time)
	*	report.html (A webpage where Supervisor can see checkIn time of students)

### Demo Links
+ Co-ordinator Webpage  - http://checkinapp.ezyro.com/index.html?f=robotic_19-07-2021.txt
+ Supervisor Webpage - http://checkinapp.ezyro.com/report.html?f=robotic_19-07-2021.txt

here 'f ' if sample project file for the date 19 July 2021.

function balance() {
	var rawSource = $('#source-data').val();

	if (! rawSource) {
		alert("Please enter some students.")
		return;
	}

	cleanedRawSource = rawSource.replace(/\t/g, ",");

	var students = CSVToArray(cleanedRawSource);

	// Parse students into arrays by level
	var levels = [[], [], [], []];
	var numberOfTables = 0;

	var minLevel = 1;
	var maxLevel = 4;

	var numberStudents = students.length;
	for (var currentStudent = 0; currentStudent < numberStudents; currentStudent++) {
		var student = students[currentStudent];
		var studentName = student[0];
		var studentLevel = student[1];

		// Only accept students in levels 1, 2, 3, or 4
		if(! (studentLevel >= minLevel && studentLevel <= maxLevel)) {
			continue;
		}

		// Put the student in the array for their level
		var studentsAtLevel = levels[studentLevel - 1];
		if (! studentsAtLevel) {
			studentsAtLevel = [];
		}

		studentsAtLevel.push(studentName);
		levels[studentLevel - 1] = studentsAtLevel;

		// Track the largest level array, which will be the number of tables
		if (studentsAtLevel.length > numberOfTables) {
			numberOfTables = studentsAtLevel.length;
		}
	}
	
	var tableAssignmentsHTML = "<h1 class=\"display-4\" align=\"center\">Assignments</h1><div class=\"row justify-content-center\"><div class=\"col-xs\">";
	var partialTable = false;

	// Build table assignments
	for (var currentTable = 0; currentTable < numberOfTables; currentTable++) {
		// Add a header for the table
			tableAssignmentsHTML += "<h2 align=\"center\" class=\"mt-3\">Table " + (currentTable + 1) + "</h2><ol>";

		// Get a student from each level
		for (var currentLevel = 0; currentLevel < maxLevel; currentLevel ++) {
			// Get students for the level
			var studentsAtLevel = levels[currentLevel];

			// Skip this level if we're out of students
			if (studentsAtLevel.length < 1) {
				tableAssignmentsHTML += "<li value=\"" + (currentLevel + 1) + "\"><span class=\"badge badge-warning\">Skip</span></li>";
				continue;
			}

			// Get a random student from the array
			// Credit: https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
			var randomStudentNumber = Math.floor(Math.random() * studentsAtLevel.length);
			var student = studentsAtLevel[randomStudentNumber];

			// Remove that student from the array and store it back into the levels
			studentsAtLevel.splice(randomStudentNumber, 1);
			levels[currentLevel] = studentsAtLevel;

			// Quote the student name if it contains a comma
			if (student.includes(",")) {
				student = '"' + student + '"';
			}

			// Build the student's table assignment
			tableAssignmentsHTML += "<li value=\"" + (currentLevel + 1) + "\">" + student + "</li>";
		}

		tableAssignmentsHTML += "</ol>";
	}

	tableAssignmentsHTML += "</div></div>";

	$('div#table-assignments').html(tableAssignmentsHTML);
}

// Credit: https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm

// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
            ){
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[ 3 ];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    // Return the parsed data.
    return( arrData );
}
# balance-students
An application to balance seating groups based on a leveled seating (Kagan strategy) in a classroom.

## Requirements
* A modern browser

## Source Data
Build a list of column students in Excel or Numbers. The second column should be the student's level, from 1 to 4. Extra columns are fine, but the first two columns must be the student's name, then level.

| Name | Position | Extra 1 | ... | Extra N |
|---|---|---|---|---|
| Student name | Ranked level 1, 2, 3, or 4 | ignored | ignored | ignored |

## Usage
1. Copy the list of students and levels to your clipboard
1. Paste the list into the **Students** area on the page
1. Click **Balance**

## Output
* Students will be randomly grouped to tables of 4, with one person of each level at each table.
* Excess students will be grouped into tables with the missing level noted

## Contributing
Pull requests are welcome!
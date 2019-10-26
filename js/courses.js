
function build_course_tbl (rsltdata) {
	// var tblht = $("#user-list-tbl").height() - 88;
		// var tblhtpx = tblht.toString() + "px";
		// $("#user-list-tbl").removeAttr('width').DataTable( {
	$("#course-list-tbl").DataTable( {
		"bInfo": false,
		"bFilter": false,
		autoWidth: true,
		responsive: true,
		scrollY: "260px",
		scrollX: true,
		scrollCollapse: true,
		stateSave: true,
		paging: false,
		"data": rsltdata,
		rowId: 'id',
		// note the passing of 'id' as the second column - the reason is for the render, and the resulting link set up
		columns: [
			{ data: "fac_name", "width": "300px", "title": "Facility" }, 
			{ data: "desc_id", "width": "100px", "title": "Course Name" }, 
			{ data: "cohort_title", "width": "150px", "title": "Cohort"},
			{ data: "id", "width": "40px", "title": "ID", "visible": false}
		] } );
}


function gen_course_content(course_id) {
  // filter out the content of just the desired course - this only sets up the data, no visual update
  let newdata = window.dataobj.course_content.filter(function (e) { return e.course_id == course_id });

  let tblarray = [];
  let tmpobj = {};
  // go through 52 weeks, looking for each week_num equal to the current week. Do it in batches of 13,
  // each 13 is an 'object' in the object array to be used by JQ DataTable. Have to do it this way because
  // it is possible some weeks will have nothing - so look for each week
  for (nrow=1; nrow <= 4; nrow++) {
    for (ncol=1; ncol <= 13; ncol++) {
      let chtmlstuff = '<div class=gridcell>';
      let calcwk = ncol + ((nrow - 1) * 13);
      let colname = 'subweek' + ncol.toString();
      let tmpa = newdata.filter(function (item) { return item.week_num == calcwk });
      for (ix=0; ix < tmpa.length; ix++) {
        // put text together for display
        chtmlstuff = chtmlstuff + "<p class='gridtext'><strong>" + tmpa[ix].unit_title + "</strong> - " + tmpa[ix].module_name + "</p>";
      }
      // now that all items of a single week have been merged, add the 'column' to the DataTable array object
      chtmlstuff = chtmlstuff + "</div>";
      tmpobj[colname] = chtmlstuff;
    }
    // now that all the 13 weeks of the quarter have been merged, "push" the "row" into the DataTable array
    tmpobj['quarter'] = nrow;
    tblarray.push(tmpobj);
    tmpobj = {};
  }
  window.dataobj.course_selected = tblarray;
}

function build_sel_course_tbl (rsltdata) {
	// var tblht = $("#user-list-tbl").height() - 88;
	// var tblhtpx = tblht.toString() + "px";
	// $("#user-list-tbl").removeAttr('width').DataTable( {
	$("#course-detail-list-tbl").removeAttr('.width').DataTable( {
	"bInfo": false,
	"bFilter": false,
	autoWidth: true,
	responsive: true,
	scrollY: "250px",
	scrollX: true,
	scrollCollapse: true,
	stateSave: true,
	paging: false,
	"data": rsltdata,
	// note the passing of 'id' as the second column - the reason is for the render, and the resulting link set up
	columns: [
		{ data: "quarter", "width": "50px", "title": "Quarter", className: "q-cent" },
		{ data: "subweek1", "width": "200px", "title": "Week 1", className: "course-grid" },
		{ data: "subweek2", "width": "200px", "title": "Week 2", className: "course-grid" },
		{ data: "subweek3", "width": "200px", "title": "Week 3", className: "course-grid" },
		{ data: "subweek4", "width": "200px", "title": "Week 4", className: "course-grid" },
		{ data: "subweek5", "width": "200px", "title": "Week 5", className: "course-grid" },
		{ data: "subweek6", "width": "200px", "title": "Week 6", className: "course-grid" },
		{ data: "subweek7", "width": "200px", "title": "Week 7", className: "course-grid" },
		{ data: "subweek8", "width": "200px", "title": "Week 8", className: "course-grid" },
		{ data: "subweek9", "width": "200px", "title": "Week 9", className: "course-grid" },
		{ data: "subweek10", "width": "200px", "title": "Week 10", className: "course-grid" },
		{ data: "subweek11", "width": "200px", "title": "Week 11", className: "course-grid" },
		{ data: "subweek12", "width": "200px", "title": "Week 12", className: "course-grid" },
		{ data: "subweek13", "width": "200px", "title": "Week 13", className: "course-grid" }
	] }
	);
	$('#course-detail-list-tbl td').click(function() {
		var column_num = parseInt( $(this).index() ) + 1;
		var row_num = parseInt( $(this).parent().index() ) + 1;
		let weekpick = ((row_num - 1) * 13) + (column_num - 1);
		// console.log(row_num, column_num, weekpick);
	});
	$('#course-detail-list-tbl td').dblclick(function() {
		var column_num = parseInt( $(this).index() ) + 1;
		var row_num = parseInt( $(this).parent().index() ) + 1;
		let weekpick = ((row_num - 1) * 13) + (column_num - 1);
		course_edit_data(17,weekpick);
		
		// console.log('user double-clicked', row_num, column_num, weekpick);
	});
}

function build_sel_course_roster_tbl (rsltdata) {
	// var tblht = $("#user-list-tbl").height() - 88;
	// var tblhtpx = tblht.toString() + "px";
	// $("#user-list-tbl").removeAttr('width').DataTable( {
	$("#detail-roster-list-tbl").DataTable( {
		"bInfo": false,
		"bFilter": false,
		autoWidth: true,
		responsive: true,
		scrollY: "240px",
		scrollX: true,
		scrollCollapse: true,
		stateSave: true,
		paging: false,
		"data": rsltdata,
		// note the passing of 'id' as the second column - the reason is for the render, and the resulting link set up
		columns: [
			{ data: "fname", "width": "100px", "title": "First Name" },
			{ data: "lname", "width": "100px", "title": "Last Name" },
			{ data: "att_id_use", "width": "77px", "title": "ID", 
				'render': function (data,type,row,meta) {
					let retdata = data;
					let attid = row.id.toString();
					if (type == 'display') {
						retdata = '<a href="javascript:bio_edit_data(' + attid + ');" title="Show Bio">' + data + '</a>';
					}
					return retdata;
				}},
			{ data: "enroll_date", "width": "100px", "title": "Enrolled"},
			{ data: "drop_date", "width": "100px", "title": "Drop Date"},
			{ data: "id", "width": "40px", "title": "ID", "visible": false}
		] }
	);
	$('#detail-roster-list-tbl td').click(function() {
		let tblref = $('#detail-roster-list-tbl').DataTable();
		let rowidx = tblref.cell( this ).index().row;
		// recall that a 'row' in a jquery DataTable is an object - a rather complex object, so get a reference to it here
		let refinfo = tblref.rows(rowidx).data();
		// may want to console.log() the refinfo item if there is a problem with understanding what is available
		// $("#name1o1").html(refinfo[0].fname + ' ' + refinfo[0].lname);
		show_roster_1o1(refinfo);
		$('#detail-roster-list-tbl tbody tr').removeClass('row-selected');
		$(this).parent().addClass('row-selected');
		// add row selection highlight stuff - remove existing highlight, then add back
		var column_num = parseInt( $(this).index() ) + 1;
		var row_num = parseInt( $(this).parent().index() ) + 1;
	});
}

function show_roster_1o1(refinfo) {
	// get the data for the person from the global object array
	// $('#name1o1').html(
	// 		'<p>' + refinfo[0].fname + ' ' + refinfo[0].lname + '</p>' +
	// 		'<p>ID: ' + refinfo[0].id + '</p>'
	// 		);
	$('#name1o1').remove();
	if ((refinfo[0].id % 2) == 1) {
		$(".samp1o1").removeClass('hidediv');
	} else {
		$(".samp1o1").addClass('hidediv');
	}

	$('#via1').remove();
	$('.viasamp').removeClass('hidediv');
	if ((refinfo[0].id % 3) == 1) {
		$('.viasamp').html('1 VIA');
	} else {
		$('.viasamp').html('No VIA yet');
	}
}

function course_edit_data (course_id, nweeknum) {
  let coursename = '';
	$('#modal-overlay').removeClass('hidediv');
  for (ni=0; ni < window.dataobj.courses.length; ni++) {
    if (window.dataobj.courses[ni].id == course_id) {
      coursename = ' ' + window.dataobj.courses[ni].fac_name + ' ' + window.dataobj.courses[ni].cohort_title;
			$('#course-week-edit-title').text(coursename + ' - Week ' + nweeknum);
      // $('#course-week-edit-title').text(coursename + ' - Week ' + nwwknum);
      break;
    }
	};
  $('.course-week-edit').removeClass('hidediv');
  $('#course-week-edit-title').width($('.course-week-edit').width() - 25);
  $('#course-edit-title-line').width($('.course-week-edit').width());
  pop_div_center('.course-week-edit');

  window.dataobj.wkdata = window.dataobj.course_content
    .filter(function(e) { return ((e.course_id == course_id) && (e.week_num == nweeknum)) } );
  build_edit_course_tbl(window.dataobj.wkdata);
}

function build_edit_course_tbl (rsltdata) {
	// var tblht = $("#user-list-tbl").height() - 88;
	// var tblhtpx = tblht.toString() + "px";
	// $("#user-list-tbl").removeAttr('width').DataTable( {
	$("#week-edit-table").DataTable( {
		"bInfo": false,	"bFilter": false,	autoWidth: true, responsive: true,	scrollY: "250px",	scrollX: true,
		scrollCollapse: true, stateSave: true, paging: false,	
		"data": rsltdata,	rowId: 'id',
    columns: [
      { data: "unit_title", "width": "250px", "title": "Unit Title", 
          "render": function (data,type,row,meta) {
                      let retdata = null;
                      if (type == 'display') {
                        retdata = '<strong>' + row.unit_title + '</strong> - ' + row.module_name
                      } else {
                        retdata = data;
                      }
                      return retdata;
                    } },
      { data: "expected_hrs", "width": "50px", "title": "Expected Hours",
          "render": function (data,type,row,meta) {
                      let retdata = null;
                      if (type == 'display') {
                        retdata = row.tally_hours == 1 ? data : "N/A";
                      } else {
                        retdata = data;
                      }
                      return retdata;
                    } }, 
      { data: "hours_done", "width": "50px", "title": "Actual Hours", 
          "render": function (data,type,row,meta) {
            let retdata = null;
            if (type == 'display') {
              retdata = row.tally_hours == 1 ? data : "N/A";
            } else {
              retdata = data;
            }
            return retdata;
          }}, 
      { data: "unit_title", "width": "100px", "title": "unittitle", "visible": false },
			{ data: "id", "width": "40px", "title": "ID", "visible": false}, 
			{ data: "comments", "width": "50px", "title": "comments", "visible": false }, 
			{ data: 'tally_hours', 'width': '30px', 'title': 'logtype', 'visible': false }
    ] } );

		// set up the click function when selecting a row
		$('#week-edit-table td').click(function() {
			let tblid = '#week-edit-table';
			let tblref = $(tblid).DataTable();
			let rowidx = tblref.cell( this ).index().row;
			// recall that a 'row' in a jquery DataTable is an object - a rather complex object, so get a reference to it here
			let refinfo = tblref.rows(rowidx).data();
			// may want to console.log() the refinfo item if there is a problem with understanding what is available
			// $("#name1o1").html(refinfo[0].fname + ' ' + refinfo[0].lname);
			if (refinfo[0].tally_hours == 0) {
				$('#course-chkbox-entry').removeClass('hidediv');
				$('#course-hr-entry').addClass('hidediv');
			} else {
				$('#course-chkbox-entry').addClass('hidediv');
				$('#course-hr-entry').removeClass('hidediv');
			}
			// do the row highlighting
			$(tblid + ' tbody tr').removeClass('row-selected');
			$(this).parent().addClass('row-selected');
			$('#course-de-id').val(refinfo[0].id);
      $('#course-de-comments').val(refinfo[0].comments);
      $('#course-de-attend-title').text("Attendance for Unit: " + refinfo[0].unit_title);
			if (refinfo[0].tally_hours == 1) {
				// the type of data entry is actual hours, so put the value in the input
				$('#course-de-time').val(refinfo[0].hours_done);
        $('.course-edit-bottom').removeClass('hidediv');
			} else {
				//   if tally_hours is 0, this is a 'checkbox' type input. we still use the hours_done for actual recording - i.e. if
				// hours_done is 1, check the box, if 0, uncheck the box. Also, do not show attendance for that unit
        $('.course-edit-bottom').addClass('hidediv');
				if (refinfo[0].hours_done == 0) {
					// remove the check on the checkbox
          // $('#coures-de-done').val(refinfo[0].hours_done);
          $('#course-de-done').prop('checked',false);
				} else {
					// check the box in the checkbox
					$('#course-de-done').prop('checked',true);
				}
      }
		});


    // Build the attendance table as well - thus can use the same weeknum and course id
    
    let edit_attend_data = window.dataobj.course_attendance.filter(function (e) { return e.course_id == 11 && e.unit_id == 255 });
    let tmpobj = {};
    for (let nd = 0; nd < edit_attend_data.length; nd++) {
      tmpobj = edit_attend_data[nd];
      // console.log(tmpobj);
      for (nx=0; nx < window.dataobj.course_roster.length; nx++) {
        if (window.dataobj.course_roster[nx].id == tmpobj.attend_id) {
          // console.log(window.dataobj.course_roster[nx].fname, window.dataobj.course_roster[nx].lname);
          tmpobj['fname']=window.dataobj.course_roster[nx].fname;
          tmpobj['lname']=window.dataobj.course_roster[nx].lname;
          break;
        }
      };
      edit_attend_data[nd] = tmpobj;
    };
    // console.log(edit_attend_data);

    $("#course-week-edit-attend").DataTable( {
      "bInfo": false, autoWidth: false, responsive: true, scrollY: "200px",
      scrollX: true, scrollCollapse: true, stateSave: true, paging: false,
      "data": edit_attend_data,
      rowId: 'id',
      columns: [
        { data: "fname", "width": "100px", "title": "First Name" },
        { data: "lname", "width": "100px", "title": "Last Name" },
				{ data: "attend_type", "width": "80px", "title": "Attendance", 
					"render": function (data,type,row,meta) {
							let retdata = null;
							if (type == 'display') {
								retdata = "<select>" + 
								"<option value='Present' selected>Present</option>" +
								"<option value='Tardy'>Tardy</option>" + 
								"<option value='Absent'>Absent</option>" + 
								"</select>";
							} else {
								retdata = data;
							}
							return retdata;
				} },
        { data: "id", "width": "40px", "title": "ID", "visible": false}
      ] } );
    // $('#course-week-edit-attend').DataTable.search('').draw();
    // $('input[type=search]').val('').change();
    $('#course-week-edit-attend').DataTable().search('').columns().search('').draw();

  //   now that all the tables are built, etc, select the 1st row in the week's units to get things started. Note that the click
  // was set up for the 'td' elements
  $('#week-edit-table>tbody>tr:first>td:first').trigger('click');

}

function course_de_change(editobj) {
	// this function is for data entry of course performance only - so it is assuming specific html elements
	// exist - '#course-de-id', '#week-edit-table', etc
	let datatable = $('#week-edit-table').DataTable();
	let dataid = $('#course-de-id').val();
	let dtdataid = '#' + dataid;
	let dataindex = 0
	for (ni=0; ni < window.dataobj.wkdata.length; ni++) {
		if (window.dataobj.wkdata[ni].id == dataid) {
			dataindex = ni;
			break;
		}
	}
	switch (editobj.id) {
		case 'course-de-comments':
			window.dataobj.wkdata[dataindex].comments = $('#course-de-comments').val();
			break;
		case 'course-de-time':
      window.dataobj.wkdata[dataindex].hours_done = $('#course-de-time').val();
      // want the Datatable to redraw to show the new data
			datatable.row(dtdataid).invalidate();
      datatable.row(dtdataid).draw('page');
      break;

    case 'course-de-done':
      if ($('#course-de-done').is(':checked')) {
        window.dataobj.wkdata[dataindex].hours_done = 1;
      } else {
        window.dataobj.wkdata[dataindex].hours_done = 0;
      }
			break;

    default:

	}
}

function week_edit_close() {
	$('.course-week-edit').addClass('hidediv');
	$('#modal-overlay').addClass('hidediv');  destroy_datatable("#course-week-edit-attend");
  destroy_datatable("#week-edit-table");
}
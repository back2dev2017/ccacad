
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
  let newdata = window.dataobj.course_content.filter(function (e) { return e.acad_id == course_id });

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
	scrollY: "350px",
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
			{ data: "att_id_use", "width": "77px", "title": "ID" },
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
  $('#modal_overlay').removeClass('hidediv');
  let wkdata = window.dataobj.course_content
    .filter(function(e) { return ((e.acad_id == course_id) && (e.week_num == nweeknum)) } );
  // console.log(wkdata);
  build_edit_course_tbl(wkdata);
}

function build_edit_course_tbl (rsltdata) {
	// var tblht = $("#user-list-tbl").height() - 88;
		// var tblhtpx = tblht.toString() + "px";
		// $("#user-list-tbl").removeAttr('width').DataTable( {
	$("#week-edit-table").DataTable( {
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
		rowId: 'id',
    columns: [
      { data: "unit_title", "width": "300px", "title": "Unit Title", 
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
      { data: "id", "width": "40px", "title": "ID", "visible": false}
    ] } );
    
    // Build the attendance table as well - thus can use the same weeknum and course id
    var edit_attend_data = window.dataobj.course_attendance.filter(function (e) { return e.course_id == 11 && e.unit_id == 257 });
    let tmpobj = '';
    for (let nd = 0; nd < edit_attend_data.length; nd++) {
      tmpobj = edit_attend_data[nd];
      // console.log(tmpobj);
      for (nx=0; nx < window.dataobj.course_roster.length; nx++) {
        if (window.dataobj.course_roster[nx].id == tmpobj.attend_id) {
          tmpobj['fname']=window.dataobj.course_roster[nx].fname;
          tmpobj['lname']=window.dataobj.course_roster[nx].lname;
          break;
        }
      };
      edit_attend_data[nx] = tmpobj;
    };

    $("#course-week-edit-attend").DataTable( {
      "bInfo": false, autoWidth: true, responsive: true, scrollY: "200px",
      scrollX: true, scrollCollapse: true, stateSave: true, paging: false,
      "data": edit_attend_data,
      rowId: 'id',
      columns: [
        { data: "fname", "width": "100px", "title": "First Name" },
        { data: "lname", "width": "100px", "title": "Last Name" },
        { data: "attend_type", "width": "100px", "title": "Attendance" },
        { data: "id", "width": "40px", "title": "ID", "visible": false}
      ] } );
}

function course_edit_cancel() {
	$('.course-edit').addClass('hidediv');
	$('#modal-overlay').addClass('hidediv');
}
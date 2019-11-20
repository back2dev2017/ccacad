
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
};


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
  };
  window.dataobj.course_data_list = tblarray;
};

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
};

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
						retdata = '<a href="javascript:bio_edit_data(' + attid + ');" title="Attendee Details">' + data + '</a>';
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
		$('#detail-roster-list-tbl tbody tr').removeClass('row-selected');
		$(this).parent().addClass('row-selected');
		// add row selection highlight stuff - remove existing highlight, then add back
		var column_num = parseInt( $(this).index() ) + 1;
		var row_num = parseInt( $(this).parent().index() ) + 1;
	});
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
};

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

};

function edit_fg_data (coursenum) {
	destroy_datatable("#fg-edit-table");
	$("#modal-overlay").removeClass("hidediv");
	$(".course-formation-group-mgmt").removeClass("hidediv");
	pop_div_center(".course-formation-group-mgmt");
	$("#fg-course-id").val(coursenum);
	$.post(service_def, 
		{ api_func: "GET_FORMATION_GROUP", p_course_id: coursenum },
		function (rslt) {
      console.log(rslt);
			dataobj.fg_data = rslt;
      build_fg_tbl(rslt, "#fg-edit-table");
		}, "json" );
};


function build_fg_tbl (rsltdata, tblref) {
	// var tblht = $("#user-list-tbl").height() - 88;
	// var tblhtpx = tblht.toString() + "px";
	// $("#user-list-tbl").removeAttr('width').DataTable( {
  for (let i=0; i<rsltdata.length; i++)  {
    let tcount = 0;
    dataobj.course_roster.forEach(function(person) {
      if (rsltdata[i].id == person.formation_group_id) {tcount += 1;}
    });
    rsltdata[i].assigned_count = tcount;
  };

	$(tblref).DataTable( {
		"bInfo": false,
		"bFilter": false,
		autoWidth: true,
		responsive: true,
		scrollY: "200px",
		scrollX: true,
		scrollCollapse: true,
		stateSave: true,
		paging: false,
		"data": rsltdata,
		rowId: 'id',
		// note the passing of 'id' as the second column - the reason is for the render, and the resulting link set up
		columns: [
      { data: "id", "width": "50px", "title": "id", "visible":false }, 
      { data: "course_id", "width": "65px", "title": "course id", "visible":false }, 
			{ data: "group_name", "width": "80px", "title": "Group Name" }, 
			{ data: "assigned_count", "width": "80px", "title": "Assigned", className:'q-cent' },
      { data: "group_name", "width": "100px", "title": "",
        'render': function (data,type,row,meta) {
          let retdata = data;
          let delid = row.id.toString();
          let delcourseid = row.course_id.toString();
          if (type == 'display') {
            retdata = '<a class="txt-link-red" href="javascript:fg_del_data(' + delid + ',' + delcourseid + ');" >Delete</a>';
          }
          return retdata;
        }},
		] } );
};

function fg_edit_close() {
	$('.course-formation-group-mgmt').addClass('hidediv');
	$('#modal-overlay').addClass('hidediv');
};



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
	};
};

function week_edit_close() {
	$('.course-week-edit').addClass('hidediv');
	$('#modal-overlay').addClass('hidediv');  destroy_datatable("#course-week-edit-attend");
  destroy_datatable("#week-edit-table");
};

function toggle_bio_detail() {
	if ($('#bio-expand-div').text() == '+ Expand Bio') {
		$('.bio-more').removeClass('hidediv');
		$('#bio-expand-div').text('- Minimize Bio');
		console.log('should have un-hidden');
	} else {
		$('.bio-more').addClass('hidediv');
		$('#bio-expand-div').text('+ Expand Bio');
	};
};

function bio_edit_data(attendeeid, courseid, editmode = "E") {
	let partdata = dataobj.course_roster.filter(function(btmp) {
		return btmp.id == attendeeid.toString();
	});
	// display the content for editing
	$(".one-course-pages").addClass("hidediv");
	$(".course-attendee").removeClass("hidediv");
	resize_maindiv('.course-attendee');
	// set some visuals - prevent need to scroll whole page
	// TODO: set height of div to prevent whole-screen scroll	
	$('.bio-subsect').height(dataobj.maindivheight - $('#bio-expand-div').position().top);
	bio_set_fg_opts(partdata.course_id);

	// assign data to data entry items.
	bio_assign_data(partdata);

	// adjust the title line - special 'row' that acts as a window title
  attendee_load_1on1(partdata[0].course_id, partdata[0].id);
  attendee_load_vias(partdata[0].course_id, partdata[0].id);
  attendee_load_attendance(partdata[0].course_id, partdata[0].id);
  attendee_load_discipline(partdata[0].course_id, partdata[0].id);
};


function bio_set_fg_opts(course_id) {
	// clear out any previous options
	$('#bio-formation-group').html('')
	// TODO: actually go get the formation groups of the course
	let tlist = [{'group_name':'Eagle', 'group_id':20},{'group_name':'Dove', 'group_id':4}];
	tlist.forEach(function(item){
		$('#bio-formation-group').append(`<option value=${item.group_id} >${item.group_name}</option>`);
	});
};

function bio_assign_data(biodata) {
	$('#bio-id').val(biodata[0].id);
	$('#bio-course-id').val(biodata[0].course_id);
	$('#bio-enroll-date').val(biodata[0].enroll_date);
	$('#bio-drop-date').val(biodata[0].drop_date);
	$('#bio-fname').val(biodata[0].fname);
	$('#bio-lname').val(biodata[0].lname);
	$('#bio-age').val(biodata[0].age);
	$('#bio-formation-group').val(biodata[0].formation_group_id);
	$('#bio-doc-num').val(biodata[0].doc_number);
	$('#bio-first-arrest-age').val(biodata[0].first_arrest_age);
	$('#bio-prev-conv').val(biodata[0].previous_convictions);
	$('#bio-fam-crime').val(biodata[0].fam_crime_history);
	$('#bio-num-child').val(biodata[0].num_child);
	$('#bio-marr-status').val(biodata[0].marital_status);
	$('#bio-num-pos-model').val(biodata[0].num_positive_model);
  $('#bio-attendee-id').val(biodata[0].att_id_use);
  $('#bio-release-date').val(biodata[0].release_date);
  $('#bio-parole-eligible').val(biodata[0].parole_eligible);
	$('#bio-workbook-stat').val(biodata[0].workbook_status);
	if (biodata[0].gender != null) {
		biodata[0].gender == 'M' ? $('#bio-male').prop('checked',true) : $('#bio-female').prop('checked',true);
	};
	$('#bio-race').val(biodata[0].race);
	if (biodata[0].military != null) {
		biodata[0].military == 1 ? $('#bio-mil-yes').prop('checked',true) : $('#bio-mil-no').prop('checked',true);
	};
	if (biodata[0].citizen != null) {
		biodata[0].citizen == 1 ? $('#bio-citizen-yes').prop('checked',true) : $('#bio-citizen-no').prop('checked',true);
	};
  $('#bio-email').val(biodata[0].email);
	$('#bio-first-arrest-age').val(biodata[0].first_arrest_age);
	$('#bio-prev-conv').val(biodata[0].previous_convictions);
	$('#bio-adult-incar').val(biodata[0].adult_incarcerations);
	$('#bio-fam-crime').val(biodata[0].family_crime_history);
	$('#bio-num-discipline').val(biodata[0].num_discipline_infractions);
	$('#bio-num-child').val(biodata[0].num_child);
	$('#bio-fam-involve').val(biodata[0].fam_involve);
	$('#bio-fam-relation').val(biodata[0].fam_relationship);
	$('#bio-num-addr-change').val(biodata[0].num_addr_change);
	$('#bio-friends').val(biodata[0].friendships);
	$('#bio-friend-record').val(biodata[0].num_friends_criminal);
	$('#bio-friend-incarc').val(biodata[0].friends_during_prison);
	if (biodata[0].use_alcohol != null) {
		biodata[0].use_alcohol == 1 ? $('#bio-use-alcohol-yes').prop('checked',true) : $('#bio-use-alcohol-no').prop('checked',true);
	};
	if (biodata[0].use_drugs != null) {
		biodata[0].use_drugs == 1 ? $('#bio-use-drug-yes').prop('checked',true) : $('#bio-use-drug-no').prop('checked',true);
	};
	if (biodata[0].current_alcohol != null) {
		biodata[0].current_alcohol == 1 ? $('#bio-curr-alc-yes').prop('checked',true) : $('#bio-curr-alc-no').prop('checked',true);
	};
	if (biodata[0].current_drug != null) {
		biodata[0].current_drug == 1 ? $('#bio-curr-drug-yes').prop('checked',true) : $('#bio-curr-drug-no').prop('checked',true);
	};
	if (biodata[0].use_contrib_crime != null) {
		biodata[0].use_contrib_crime == 1 ? $('#bio-use-crime-yes').prop('checked',true) : $('#bio-use-crime-no').prop('checked',true);
	};
	$('#bio-highest-ed').val(biodata[0].highest_education);
	if (biodata[0].school_expel != null) {
		biodata[0].school_expel == 1 ? $('#bio-school-expel-yes').prop('checked',true) : $('#bio-school-expel-no').prop('checked',true);
	};
	if (biodata[0].skill_plan != null) {
		biodata[0].skill_plan == 1 ? $('#bio-skill-plan-yes').prop('checked',true) : $('#bio-skill-plan-no').prop('checked',true);
	};
	$('#bio-skill-plan-explain').val(biodata[0].skill_plan_explain);	
	$('#bio-employ').val(biodata[0].employ);
	if (biodata[0].currently_employed != null) {
		biodata[0].currently_employed == 1 ? $('#bio-emp-incarc-yes').prop('checked',true) : $('#bio-emp-incarc-no').prop('checked',true);
	};
	if (biodata[0].employ_plan != null) {
		biodata[0].employ_plan == 1 ? $('#bio-emp-plan-yes').prop('checked',true) : $('#bio-emp-plan-no').prop('checked',true);
	};
	$('#bio-emp-plan-explain').val(biodata[0].employ_plan_explain);
	$('#bio-clubs').val(biodata[0].clubs_prior);
	$('#bio-clubs-incarc').val(biodata[0].clubs_in_prison);
	if (biodata[0].club_leader != null) {
		biodata[0].club_leader == 1 ? $('#bio-lead-prosocial-yes').prop('checked',true) : $('#bio-lead-prosocial-no').prop('checked',true);
	};
	$('#bio-lead-prosocial-explain').val(biodata[0].club_leader_explain);
	$('#bio-lead-club-incarc').val(biodata[0].club_leader_prison_explain);
	$('#bio-express').val(biodata[0].express_needs);
	$('#bio-understand').val(biodata[0].understand_other_views);
	$('#bio-make-friends').val(biodata[0].make_friends);
	$('#bio-accept-critic').val(biodata[0].accept_criticism);
	$('#bio-give-critic').val(biodata[0].provide_good_criticism);
	$('#bio-accept-resp').val(biodata[0].accept_responsibility);
	$('#bio-confident-prob').val(biodata[0].manage_problems);
	$('#bio-dev-goals').val(biodata[0].develop_goals);
	$('#bio-mng-money').val(biodata[0].manage_money);
};

function bio_save_data() {
	let tobj = {};
	tobj.id = $('#bio-id').val();
	tobj.course_id = $('#bio-course-id').val();
	tobj.enroll_date = $('#bio-enroll-date').val();
	tobj.drop_date = $('#bio-drop-date').val();
	tobj.fname = $('#bio-fname').val();
	tobj.lname = $('#bio-lname').val();
	tobj.age = $('#bio-age').val();
	tobj.doc_number = $('#bio-doc-num').val();
	tobj.first_arrest_age = $('#bio-first-arrest-age').val();
	tobj.previous_convictions = $('#bio-prev-conv').val();
	tobj.fam_crime_history = $('#bio-fam-crime').val();
	tobj.num_child = $('#bio-num-child').val();
	tobj.marital_status = $('#bio-marr-status').val();
	tobj.num_positive_model = $('#bio-num-pos-model').val();
	tobj.att_id_use = $('#bio-attendee-id').val();
	tobj.release_date = $('#bio-release-date').val();
	tobj.parole_eligible = $('#bio-parole-eligible').val();
	tobj.workbook_status = $('#bio-workbook-stat').val();
	tobj.gender = $('#bio-male').prop('checked') ? 'M' : 'F';
	tobj.race = $('#bio-race').val();
	tobj.military = $('#bio-mil-yes').prop('checked') ? 1 : 0;
	tobj.citizen = $('#bio-citizen-yes').prop('checked') ? 1 : 0;
	tobj.email = $('#bio-email').val();
	tobj.first_arrest_age = $('#bio-first-arrest-age').val();
	tobj.formation_group_id = $('#bio-formation-group').val();
	tobj.previous_convictions = $('#bio-prev-conv').val();
	tobj.adult_incarcerations = $('#bio-adult-incar').val();
	tobj.family_crime_history = $('#bio-fam-crime').val();
	tobj.num_discipline_infractions = $('#bio-num-discipline').val();
	tobj.num_child = $('#bio-num-child').val();
	tobj.fam_involve = $('#bio-fam-involve').val();
	tobj.fam_relationship = $('#bio-fam-relation').val();
	tobj.num_addr_change = $('#bio-num-addr-change').val();
	tobj.friendships = $('#bio-friends').val();
	tobj.num_friends_criminal = $('#bio-friend-record').val();
	tobj.friends_during_prison = $('#bio-friend-incarc').val();
	tobj.use_alcohol = $('#bio-use-alcohol-yes').prop('checked') ? 1 : 0;
	tobj.use_drugs = $('#bio-use-drug-yes').prop('checked') ? 1 : 0;
	tobj.current_alcohol = $('#bio-curr-alc-yes').prop('checked') ? 1 : 0;
	tobj.current_drug = $('#bio-curr-drug-yes').prop('checked') ? 1 : 0;
	tobj.use_contrib_crime = $('#bio-use-crime-yes').prop('checked') ? 1 : 0;
	tobj.highest_education = $('#bio-highest-ed').val();
	tobj.school_expel = $('#bio-school-expel-yes').prop('checked') ? 1 : 0;
	tobj.skill_plan = $('#bio-skill-plan-yes').prop('checked') ? 1 : 0;
	tobj.skill_plan_explain = $('#bio-skill-plan-explain').val();
	tobj.employ = $('#bio-employ').val();
	tobj.currently_employed = $('#bio-emp-incarc-yes').prop('checked') ? 1 : 0;
	tobj.employ_plan = $('#bio-emp-plan-yes').prop('checked') ? 1 : 0;
	tobj.employ_plan_explain = $('#bio-emp-plan-explain').val();
	tobj.clubs_prior = $('#bio-clubs').val();
	tobj.clubs_in_prison = $('#bio-clubs-incarc').val();
	tobj.club_leader = $('#bio-lead-prosocial-yes').prop('checked') ? 1 : 0;
	tobj.club_leader_explain = $('#bio-lead-prosocial-explain').val();
	tobj.club_leader_prison_explain = $('#bio-lead-club-incarc').val();
	tobj.express_needs = $('#bio-express').val();
	tobj.understand_other_views = $('#bio-understand').val();
	tobj.make_friends = $('#bio-make-friends').val();
	tobj.accept_criticism = $('#bio-accept-critic').val();
	tobj.provide_good_criticism = $('#bio-give-critic').val();
	tobj.accept_responsibility = $('#bio-accept-resp').val();
	tobj.manage_problems = $('#bio-confident-prob').val();
	tobj.develop_goals = $('#bio-dev-goals').val();
	tobj.manage_money = $('#bio-mng-money').val();

	$.post(service_def, 
		{ api_func: "PUT_ATTENDEE_DATA", p_id:tobj.id, p_fname:tobj.fname, p_lname:tobj.lname, 
			p_age:tobj.age, p_doc_number:tobj.doc_number, p_first_arrest_age:tobj.first_arrest_age, 
			p_previous_convictions:tobj.previous_convictions, p_fam_crime_history:tobj.fam_crime_history, 
			p_num_child:tobj.num_child, p_marital_status:tobj.marital_status, p_num_positive_model:tobj.num_positive_model, 
			p_att_id_use:tobj.att_id_use, p_release_date:tobj.release_date, p_parole_eligible:tobj.parole_eligible, 
			p_workbook_status:tobj.workbook_status, p_gender:tobj.gender, p_race:tobj.race, 
			p_military:tobj.military, p_citizen:tobj.citizen, p_email:tobj.email, 
			p_adult_incarcerations:tobj.adult_incarcerations, 
			p_family_crime_history:tobj.family_crime_history, p_num_discipline_infractions:tobj.num_discipline_infractions, 
			p_fam_involve:tobj.fam_involve, p_fam_relationship:tobj.fam_relationship, p_num_addr_change:tobj.num_addr_change, 
			p_friendships:tobj.friendships, p_num_friends_criminal:tobj.num_friends_criminal, p_friends_during_prison:tobj.friends_during_prison, 
			p_use_alcohol:tobj.use_alcohol, 
			p_use_drugs:tobj.use_drugs, p_current_alcohol:tobj.current_alcohol, p_current_drug:tobj.current_drug, 
			p_use_contrib_crime:tobj.use_contrib_crime, p_highest_education:tobj.highest_education, p_school_expel:tobj.school_expel, 
			p_skill_plan:tobj.skill_plan, p_skill_plan_explain:tobj.skill_plan_explain, p_employ:tobj.employ, 
			p_currently_employed:tobj.currently_employed, p_employ_plan:tobj.employ_plan, 
			p_employ_plan_explain:tobj.employ_plan_explain, p_clubs_prior:tobj.clubs_prior, 
			p_clubs_in_prison:tobj.clubs_in_prison, p_club_leader:tobj.club_leader, p_club_leader_explain:tobj.club_leader_explain, 
			p_express_needs:tobj.express_needs, 
			p_understand_other_views:tobj.understand_other_views, p_make_friends:tobj.make_friends, 
			p_accept_criticism:tobj.accept_criticism, p_provide_good_criticism:tobj.provide_good_criticism, p_accept_responsibility:tobj.accept_responsibility, 
			p_manage_problems:tobj.manage_problems, p_develop_goals:tobj.develop_goals, p_manage_money:tobj.manage_money,
			p_course_id:tobj.course_id, p_enroll_date:tobj.enroll_date, p_drop_date:tobj.tobj.drop_date, 
			p_club_leader_prison_explain:tobj.club_leader_prison_explain, p_formation_group_id:tobj.formation_group_id
		}, 
		function (rslt) {
			console.log(rslt); 
		}, "json" );

	// put data into local array of data
	for (let i=0; i<dataobj.course_roster.length; i++) {
		if (dataobj.course_roster[i].id == tobj.id) {
      dataobj.course_roster[i] = tobj;
      break;
		};
	};
};

function attendee_load_1on1(course_id, attendee_id) {
	$.post(service_def, 
		{ api_func: "GET_1ON1_DATA", p_attendee_id: attendee_id, p_course_id: course_id },
		function (rslt) {
			console.log(rslt);
			dataobj.attendee_1on1 = rslt;
      build_1on1_tbl(rslt);
		}, "json" );
	// $.post(service_def, 
	// 	{ api_func: "GET_1ON1_DATA", p_attendee_id: attendee_id, p_course_id: course_id },
	// 	function (rslt) {
	// 		console.log(rslt);
	// 	});  
};

function build_1on1_tbl (rsltdata) {
  // data expected to be sorted in reverse chrono
  $("#bio-1on1-table").DataTable( {
		"bInfo": false,
		"bFilter": false,
		autoWidth: true,
		responsive: true,
		scrollY: "150px",
		scrollX: true,
		scrollCollapse: true,
		stateSave: true,
		paging: false,
		"data": rsltdata,
		rowId: 'id',
    // note the passing of 'id' as the second column - the reason is for the render, and the resulting link set up
		columns: [
      { data: "meeting_date", "width": "75px", "title": "Date",
        'render': function(data,type,row,meta) {
          let retdata = data;
          let dataid = row.id.toString();
          if (type == 'display') {
            retdata = '<a href="javascript:bio_edit_1on1_item(' + dataid + ');" title="Edit One on One Meeting">' + data + '</a>';
          }
          return retdata;
        }}, 
			{ data: "meeting_notes", "width": "400px", "title": "Meeting Notes", 
				'render': function(data,type,row,meta) {
					let retdata = data;
					if (type == 'display') {
						retdata = '<div class="bio-1on1-note">' + data + '</div>';
					};
					return retdata;
				}}, 
			{ data: "course_id", "width": "200px", "title": "", "visible": false}
		] } );
};

function bio_edit_1on1_item(rowid) {

};

function attendee_load_vias(course_id, attendee_id) {
  console.log('loading vias');
};
function attendee_load_discipline(course_id, attendee_id) {
  console.log('loading vias');
};
function attendee_load_attendance(course_id, attendee_id) {
	$.post(service_def, 
		{ api_func: "GET_ATTENDEE_ATTEND", p_course_id:course_id, p_attendee_id:attendee_id },
		function (rslt) {
			// console.log(rslt);
			dataobj.attendee_attend = rslt;
			destroy_datatable('#bio-attend-data');
			build_attend_tbl(rslt, '#bio-attend-data');
		}, "json" );
		// $.post(service_def, 
		// 	{ api_func: "GET_ATTENDEE_ATTEND", p_course_id:course_id, p_attendee_id:attendee_id },
		// 	function (rslt) {
		// 		console.log(rslt);
		// 	});
};

function build_attend_tbl(rsltdata, tblref) {
	$(tblref).DataTable( {
		"bInfo": false,
		"bFilter": false,
		autoWidth: true,
		responsive: true,
		scrollY: "260px",
		scrollX: true,
		scrollCollapse: true,
		stateSave: true,
		paging: false,
		"order": [[3, 'asc']],
		"data": rsltdata,
		rowId: 'id',
    // note the passing of 'id' as the second column - the reason is for the render, and the resulting link set up
		columns: [
      { data: "title", "width": "140px", "title": "Unit"},
			{ data: "module_name", "width": "130px", "title": "Module" }, 
			{ data: "attend_type", "width": "70px", "title": "Attendance"},
			{ data: "week_num", "width":"60px", "title":"Week", "visible":false}
		]});
};

function bio_edit_close() {
	$(".one-course-pages").addClass("hidediv");
  $(".course-tracking").removeClass("hidediv");
};
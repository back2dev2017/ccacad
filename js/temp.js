function attendee_load_disc(course_id, attendee_id) {
	// $.post(service_def, 
	// 	{ api_func: "GET_1ON1_DATA", p_attendee_id: attendee_id, p_course_id: course_id },
	// 	function (rslt) {
	// 		console.log(rslt);
	// 		dataobj.attendee_1on1 = rslt;
  //     build_1on1_tbl(rslt, "#bio-discs-table");
	// 	}, "json" );
	destroy_datatable('#bio-disc-table');
	build_disc_tbl(dataobj.course_attendee_disc, "#bio-disc-table");
	// $.post(service_def, 
	// 	{ api_func: "GET_1ON1_DATA", p_attendee_id: attendee_id, p_course_id: course_id },
	// 	function (rslt) {
	// 		console.log(rslt);
	// 	});
};

function build_disc_tbl(rsltdata, refele) {
  $(refele).DataTable( {
		"bInfo": false, "bFilter": false, autoWidth: true, responsive: true, scrollY: "150px", scrollX: true, scrollCollapse: true,
		stateSave: true, paging: false, "data": rsltdata, rowId: 'id',
		columns: [
      { data: "disc_date", "width": "80px", "title": "Date",
        'render': function(data,type,row,meta) {

					let retdata = data;
					let editparms = `${row.attendee_id.toString()},${row.course_id.toString()},'E',` + 
													`'${refele}', '#${row.id}'`;
          if (type == 'display') {
            retdata = '<a href="javascript:bio_edit_disc_item(' + editparms + ');" title="Edit discipline data">' + data + '</a>';
          }
          return retdata;
        }}, 
      { data: "disc_id", "width": "100px", "title": "Discipline ID"},        
      { data: "notes", "width": "150px", "title": "Category", 
				'render': function(data,type,row,meta) {
					let retdata = data;
					if (type == 'display') {
						retdata = '<div class="bio-1on1-note">' + data + '</div>';
					};
					return retdata;
				}}, 
			{ data: "id", "width": "20px", "title": "", "visible": false},
			{ data: "notes", "width": "200px", "title": "", "visible": false},
			{ data: "course_id", "width": "200px", "title": "", "visible": false},
			{ data: "attendee_id", "width": "40px", "title": "", "visible": false}
		] } );
};

function bio_edit_disc_item(coursenum, attendeeid, editmode, dtref, rowid) {
	$("#modal-overlay").removeClass("hidediv");
	$(".bio-disc-edit").removeClass("hidediv");
	pop_div_center(".bio-disc-edit");
	console.log('inside bio_edit_disc_edit');
	$("#bio-disc-edit-course-id").val(coursenum);
	$("#bio-disc-edit-attendee-id").val(attendeeid);
	$('#bio-disc-edit-editmode').val(editmode);
	if (editmode == 'E') {
		let partdata = $(dtref).DataTable().row(rowid).data();
		console.log(partdata);
		$('#bio-disc-edit-date').val(partdata.given_date.toString());
		$('#bio-disc-edit-notes').val(partdata.meeting_notes);
		$('#bio-disc-edit-category').val(partdata.category);
	} else {
		let today = new Date();
		// $('#bio-disc-edit-meeting-date')
		// 	.val(today.getFullYear() + '-' + 
		// 	('0' + (today.getMonth() + 1)).slice(-2) + '-' + 
		// 	('0' + today.getDate()).slice(-2));
		$('#bio-disc-edit-date').val(getdatestr_fromdate(today));
		$('#bio-disc-edit-notes').val('');
		$('#bio-disc-edit-category').val('');
	};
};

function disc_edit_close() {
	$(".bio-disc-edit").addClass("hidediv");
	$('#modal-overlay').addClass('hidediv');
};
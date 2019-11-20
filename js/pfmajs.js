function data_setup() {
  // load up the html files
  loadhtmls();

  // pull back all sessions (units)
	$.post(service_def, 
		{ api_func: "GET_SESSION_LIST" },
		function (rslt) {
      window.dataobj.units = rslt;
		}, "json" );

	$.post(service_def, 
		{ api_func: "GET_USERS" },
		function (rslt) {
			window.dataobj.users = rslt;
		}, "json" );

	$.post(service_def, 
		{ api_func: "GET_COURSES" },
		function (rslt) {
			window.dataobj.courses = rslt;
		}, "json" );

	$.post(service_def, 
		{ api_func: "GET_COURSE_CONTENT" },
		function (rslt) {
			window.dataobj.course_content = rslt;
		}, "json");

	$.post(service_def,
		{ api_func: "GET_COURSE_ROSTER", p_course_id: "11" },
		function (rslt) {
      window.dataobj.course_roster = rslt;
    }, "json");

	$.post(service_def,
		{ api_func: "GET_COURSE_ATTEND", p_course_id: "11" },
		function (rslt) {
      window.dataobj.course_attendance = rslt;
    }, "json");

  $.post(service_def,
    { api_func: "GET_FORMATION_GROUP", p_course_id: "99" },
    function (rslt) {
      window.dataobj.course_fg = rslt;
    }, "json");

  // for now, forcing course to course id 11
  dataobj.selected_course = 11;

	// set up 'main divs' dimentions - recall, single-page-app - hiding/showing divs is the navigation method - scrolling
	// is bad design, so set up sizes for the main conent divs to be able to scroll internally only if needed
  let totalh = Math.min($(window).height(), $(document).height(), 1024);
  let totalw = Math.min($(window).width(), $(document).width(), 1280);
  dataobj.maindivheight = totalh - $('#main-heading').height() - $('#am-topmenu').height() - 60;
	dataobj.maindivwidth = totalw - $('.l-sidebar').width() - 40;
};


function go_app() {
	gen_course_content(17);
	// going to specifically 'build' these tables because the courses tab is already 'visible' underneath the
	// login overlay. But the tables were not displaying right (squished columns). Building them here and then
  // calling the tab click should get them to display correctly.
  $('.login-overlay').addClass('hidediv');
}

function selecttopsection (btnclicked) {
	var btnval = btnclicked.value;
	var btnid = btnclicked.id;
	var nparmht = 0;
	var calcpad = "0px";
	/* clear active class off other buttons */
	$(".l-sidebar button").removeClass('active');
	btnclicked.classList.add("active");
	/* hide all the divs then show the one needed. Note: this assumes jquery .addClass will not dupe class names*/
	$(".content-sect").addClass("hidediv");
	// setup_data_area();
	
	switch (btnval) {

    case 'acadmgt':
      $('.blankarea').addClass('hidediv');
      $(".academy-mgmt-sect").removeClass("hidediv");
      if (window.signals.startup == 1) {
        window.signals.startup = 0;
        setTimeout(function() {$("#courses").trigger('click');}, 15);
      };
			break;

    case 'acaddash':
			$(".dashboard-sect").removeClass("hidediv");
			resize_maindiv('.dashboard-sect');
			gen_attendance_chart();
			gen_progress_chart();
			gen_via_chart();
			gen_1on1_chart();
			break;

    case 'acadrpts':
			$(".reports-sect").removeClass("hidediv");
			break;

    case 'acadspec':
		$(".misc-disp").removeClass("hidediv");
		// click the button that would display the active section
			break;
	}
}

function allnavclick (tabclicked) {
	var btnval = tabclicked.value;
	var btnid = tabclicked.id;
	var nparmht = 0;
	var calcpad = "0px";
		/* clear active class off other buttons */
		$(".tablinks").removeClass("active");
		tabclicked.classList.add("active");
		/* hide all the divs then show the one needed. Note: jquery .addClass will not dupe class names*/
		$(".mainzone-sel").addClass('hidediv');

	// setup_data_area();
	
	switch (btnval) {
		case 'curriculums':
			$(".curriculums-disp").removeClass("hidediv");
			break;

		case 'courses':
			$(".courses-disp").removeClass("hidediv");
			if ( $.fn.DataTable.isDataTable ('#course-detail-list-tbl')) {
				// because of display issues, it is better to destroy the tables each time coming into this 'tab'
				destroy_datatable('#course-detail-list-tbl');
				destroy_datatable('#detail-roster-list-tbl');
		 	}
			build_sel_course_tbl(window.dataobj.course_data_list);
			build_sel_course_roster_tbl(window.dataobj.course_roster);
			break;

		case 'surveys':
			$(".surveys-disp").removeClass("hidediv");
			break;

		case 'misc':
			$(".misc-disp").removeClass("hidediv");
			// the default selection is the user list, but remember they may be going back and forth between options
			// so only trigger the 'click' (to force a DataTable draw), if it is the current selection
			if ($('#pick-sys-user').hasClass('active')) {
				$("#pick-sys-user").trigger('click');
			}
			break;
	}
}

	
function build_user_tbl (rsltdata) {
	// var tblht = $("#user-list-tbl").height() - 88;
		// var tblhtpx = tblht.toString() + "px";
		// $("#user-list-tbl").removeAttr('width').DataTable( {
	$("#user-list-tbl").DataTable( {
		"bInfo": false,
		"bFilter": false,
		autoWidth: true,
		responsive: true,
		scrollY: "300px",
		scrollX: true,
		scrollCollapse: true,
		stateSave: true,
		paging: false,
		"data": rsltdata,
	rowId: 'id',
		// note the passing of 'id' as the second column - the reason is for the render, and the resulting link set up
			columns: [
				{ data: "id", "width": "20px", "title": "ID", className: "q-cent" }, 
				{ data: "id", "width": "250px", "title": "Name", orderData: 1, 
						"render" : function ( data, type, row, meta ) { return make_link_user_edit(data, type, row, meta, "#user-list-tbl"); } },
				{ data: "email", "width": "350px", "title": "Email" },
				{ data: "phone", "width": "150px", "title": "Phone", "defaultContent": "" },
				{ data: "role", "width": "120px", "title": "Role", "defaultContent": "" }
			] } );
	// don't forget, array references are 0-based
	// $('#user-list-tbl").DataTable.draw();

	// console.log(rsltdata);
	// $("#user-list-tbl").DataTable( {
	//   "data": rsltdata,
	//   scrollY: "500px",
	//   columns: [
	//     { data: "fname", "defaultContent": "" },
	//     { data: "lname", "defaultContent": ""},
	//     { data: "email", "defaultContent": ""}
	//   ] } );
	}

function set_currsect(btn) {
	$('.curr-item').addClass('hidediv');
	$('.btncurr-submenu').removeClass('active');
	$('#' + btn.id).addClass('active');
	switch (btn.id) {
		case 'pick-curr-tmplt':
			$(".curr-sect-tmplt").removeClass("hidediv");
			break;
		case 'pick-curr-course':
			$(".course-container").removeClass("hidediv");
			break;
    case 'pick-curr-modules':
      $(".curr-sect-modules").removeClass("hidediv");
      // resize_maindiv('.curr-sect-modules');
      break;
    case 'pick-curr-units':
      $(".curr-sect-units").removeClass("hidediv");
      resize_maindiv('.curr-sect-units');
      if ( ! $.fn.DataTable.isDataTable ('#unit-list-tbl')) {
        build_unit_tbl(window.dataobj.units);
      };
			break;
	}
}

function set_syssect(btn) {
	$('.sys-item').addClass('hidediv');
	$('.btnsys-submenu').removeClass('active');
	$('#' + btn.id).addClass('active');
	switch (btn.id) {
		case 'pick-sys-facsteps':
			$(".sys-sect-facsteps").removeClass("hidediv");
			break;

    case 'pick-sys-modules':
			$(".sys-sect-modules").removeClass("hidediv");
			break;

    case 'pick-sys-user':
  		$(".sys-sect-users").removeClass("hidediv");
		  if ( ! $.fn.DataTable.isDataTable ('#user-list-tbl')) {
		  build_user_tbl(window.dataobj.users);
		}
		break;

    case 'pick-sys-facilities':
      $(".sys-sect-facilities").removeClass("hidediv");
  };
};



function call_getapiversion () {
	var sel_option = $('#aboutapiparm').val();
	var apicall = 'ADD_GETAPI_VERSION';
	$(".div-api").removeClass("hidediv");
	$("#apiinfo").removeClass("hidediv");
	resize_div(".div-api", 50);
	$.post(service_def,
			{api_func:apicall,ver_type:sel_option}, 
			function (rslt) {
				$("#apiinfo").html(rslt);
			});
}

function search_sel (selobj) {
	var optval = selobj.value;
	$(".srch-entry").addClass("hidediv");
	$("#searchinfo").addClass("hidediv");
	if (optval === "srchtxt") {
		$("#textsrch").removeClass("hidediv");
	} else if (optval === "stewtxt") {
		$("#stewsrch").removeClass("hidediv");
		$("#srch-stew").addClass("input-upper");
		get_steward_list();
	} else {
		$("#sourcesrch").removeClass("hidediv");
	}
	// if there had been a DataTable previously created, go ahead and destroy it now. If there is a performance hit, this might
	// be changeable to just removing all rows. But that may make things more complex to detect (when/where result table exists)
	srchdt_remove();
	resize_div(".div-srch-rslt", 50);
}

function miscapi_sel (selobj) {
	var optval = selobj.value;
	$(".apiopt-entry").addClass("hidediv");
	$("#searchinfo").addClass("hidediv");
	srchdt_remove();
	switch (optval) {
		case 'itemhist':
			$("#apimisc-opt-idhist").removeClass("hidediv");
			break;
		case 'undoc':
			$("#apimisc-opt-undoc").removeClass("hidediv");
			break;
		case 'setinactives':
			$("#apimisc-opt-flag").removeClass("hidediv");
			break;
		case 'getinactives':
			$("#apimisc-opt-getinactives").removeClass("hidediv");
			break;
		case 'popdd':
			$("#apimisc-opt-populate").removeClass("hidediv");
			break;
		case 'clonedefs':
			$("#apimisc-opt-clone").removeClass("hidediv");
			get_table_list();
			break;
	}

	resize_div(".div-srch-rslt", 50);	
}

function search_execute () {
	var srch_selected = $("#srch_type").val();
	var tmptext1;
	var tbl_name;
	var col_name;
	var tmpval1;
	$("#searchinfo").removeClass("hidediv")
	switch(srch_selected) {
		case "srchtxt":
			tmptext1 = $("#srch-val").val();
			tbl_name = $("#srch-tbl").val();
			col_name = $("#srch-col").val();

			$("#result-head").html("<p>Data Definition/Meaning search results</p>");
			
/*			$.post(service_def,
					{api_func:'ADD_SEARCHDD', srch_txt:tmptext1, srch_tbl:tbl_name, srch_col:col_name },
					function(rslt) { $('#srch-tbl-rslt').html(rslt); });*/
		
			if ( ! $.fn.DataTable.isDataTable ('#srch-tbl-rslt')) {
				$.post(service_def,
					{api_func:'ADD_SEARCHDD', srch_txt:tmptext1, srch_tbl:tbl_name, srch_col:col_name },
					function(rslt) { build_srch_tbl(rslt); }, "json");
			} else {
				$.post(service_def,
					{ api_func:'ADD_SEARCHDD',srch_txt:tmptext1, srch_tbl:tbl_name, srch_col:col_name },
					function(rslt) { $("#srch-tbl-rslt").DataTable().clear().rows.add(rslt).draw() }, "json"); 
			}

			break;
	
		case "stewtxt":
/*			tmptext1 = $("#srch-stew").val();*/
			tmptext1 = $("#dropsel-steward").val().trim();
			$("#result-head").html("<p>Data Definitions assigned to Steward</p>");
			if ( ! $.fn.DataTable.isDataTable ('#srch-tbl-rslt')) {
				// I really, REALLY hate anonymous functions. Note the "trick" to call a REAL-named function for better readabiity, etc
				$.post(service_def,
					{api_func:'ADD_GETDD_BY_STEWARD',steward_id:tmptext1},
					function(rslt) { build_srch_tbl(rslt); }, "json");
			} else {
				$.post(service_def,
					{ api_func:'ADD_GETDD_BY_STEWARD',steward_id:tmptext1 },
					function(rslt) { $("#srch-tbl-rslt").DataTable().clear().rows.add(rslt).draw() }, "json"); 
			}
			break;
			
		case "sourcetxt":
			tmptext1 = ($("#srch-source").val() === "" ? "(nothing entered)" : $("#srch-source").val());
			$("#result-head").html("<p>Data Definitions having the specified Source</p>");
			if ( ! $.fn.DataTable.isDataTable ('#srch-tbl-rslt')) {
				$.post(service_def,
					{api_func:'ADD_GETDD_BY_SOURCE',source_str:tmptext1},
					function(rslt) { build_srch_tbl(rslt); }, "json");
			} else {
				$.post(service_def,
					{ api_func:'ADD_GETDD_BY_SOURCE',source_str:tmptext1 },
					function(rslt) { $("#srch-tbl-rslt").DataTable().clear().rows.add(rslt).draw() }, "json"); 
			}

			break;
	

		default: 
			console.log("The type of search was not recognized: " + srch_selected);
	}
}


function misc_execute () {
	var ok_flg = 0;
	var misc_pick = $("#selmisc").val();
	var tmptext1;
	var tbl_name;
	var col_name;
	var hist_item;
	var tmpval1;
	var date_start;
	var date_end;
	$("#searchinfo").removeClass("hidediv");
	$(".div-srch-rslt").removeClass("hidediv");
	switch(misc_pick) {
		case "itemhist":
			hist_item = $("#hist-id").val()
			hist_item = (hist_item === null ? 0 : hist_item);
			tbl_name = $("#hist-tbl").val();
			col_name = $("#hist-col").val();
			date_start = $("#start-date").val();
			date_end = $("#end-date").val();
			// do some checking before invoking function
			if (hist_item > 0 || (tbl_name.trim().length > 0 && col_name.trim().length > 0)) {
				// OK, can do a history pull
				ok_flg = 1;
			} else {
				modal_msg('Entry required', 'An ID or a table/column pair is required to pull history',0,"#ffcccc");
			}			
			if (ok_flg > 0) {
				$("#result-head").html("<p>History of changes for the data item</p>");
/*				$.post(service_def,
						{api_func:'ADD_GETDD_ITEM_HISTORY', hist_id:hist_item, hist_tbl:tbl_name, hist_col:col_name, 
								hist_start:date_start, hist_end:date_end },
						function(rslt) { $('#srch-tbl-rslt').html(rslt); });*/
				if ( ! $.fn.DataTable.isDataTable ('#srch-tbl-rslt')) {
					$.post(service_def,
						{api_func:'ADD_GETDD_ITEM_HISTORY', hist_id:hist_item, hist_tbl:tbl_name, hist_col:col_name, 
								hist_start:date_start, hist_end:date_end },
						function(rslt) { build_srch_tbl(rslt, 0, 'chgdate'); }, "json");
				} else {
					$.post(service_def,
						{ api_func:'ADD_GETDD_ITEM_HISTORY', hist_id:hist_item, hist_tbl:tbl_name, hist_col:col_name,
								hist_start:date_start, hist_end:date_end }, 
						function(rslt) { $("#srch-tbl-rslt").DataTable().clear().rows.add(rslt, 0).draw() }, "json");				
				}
			}

			break;
	
		case "undoc":
			// this api is a direct call - no parms, but a table result (json) is returned
			$("#result-head").html("<p>Data Items not yet fully documented</p>");

/*			$.post(service_def,
			{api_func:'ADD_GETDD_UNDOCUMENTED' },
				function(rslt) { $('#srch-tbl-rslt').html(rslt); });*/			
		
			if ( ! $.fn.DataTable.isDataTable ('#srch-tbl-rslt')) {
				$.post(service_def,
					{api_func:'ADD_GETDD_UNDOCUMENTED'},
					function(rslt) { build_srch_tbl(rslt); }, "json" );
			} else {
				$.post(service_def,
					{ api_func:'ADD_GETDD_UNDOCUMENTED'},
					function(rslt) { $("#srch-tbl-rslt").DataTable().clear().rows.add(rslt).draw() }, "json" ); 
			}
			break;
			
		case "setinactives":
			// tmptext1 = ($("#srch-source").val() === "" ? "(nothing entered)" : $("#srch-source").val());
			$("#result-head").html("<p>Processing the data. Please wait...</p>");
			// hide the div section that normally would have a table in it
			$.post(service_def, {api_func:'ADD_POPULATE_DD_INACTIVES'}, 
				function (rslt) { 
					// rehide the div and use an alert
					$("#searchinfo").addClass("hidediv");
					modal_msg('Processing complete', 'Note the "inactive" column for data items. When an item is flagged '+ 
								'as inactive, it means the item does not exist in the database structure. This could mean ' +
								'the item has been removed (deleted) from the database schema, or it may mean the item has ' +
								'not yet been created.');
					 } );
			break;
			
		case "getinactives":
			$("#result-head").html("<p>Data Items currently flagged as Inactive</p>");
			// note that add_populate_dd_inactives returns a result set after setting inactives.
			if ( ! $.fn.DataTable.isDataTable ('#srch-tbl-rslt')) {
				$.post(service_def,
					{api_func:'ADD_POPULATE_DD_INACTIVES'},
					function(rslt) { build_srch_tbl(rslt); }, "json" );
			} else {
				$.post(service_def,
					{ api_func:'ADD_POPULATE_DD_INACTIVES' },
					function(rslt) { $("#srch-tbl-rslt").DataTable().clear().rows.add(rslt).draw() }, "json" ); 
			}

			break;

		case "popdd":
			// this api is a direct call - no parms, but a table result (json) is returned
			$("#result-head").html("<p>Processing request. Please wait...</p>");
			$.post(service_def,
				{api_func:'ADD_POPULATEDD'},
				function(rslt) { 
					// rehide the div and alert the user
					$("#searchinfo").addClass("hidediv");
					modal_msg('Processing Complete', 'Data Items have been updated in the Data Dictionary. Note that ' +
								'Data Items will NOT be deleted if they no longer exist in the database. Instead they ' + 
								'are flagged as inactive and should be reviewed before deleting.');
					} );
			break;

		case "clonedefs":
/*			so, the user decided to copy a whole set of definitions from one table to another. Invoke the api function
			it may be nice to display the copied values after the process has completed  */
			var info_from = $("#dropsel-fromtable").val();
			var info_to = $("#txt-totable").val();
			// console.log('from table - ' + info_from);
			// console.log('to table - ' + info_to);
			if (info_from.trim().length == 0 || info_to.trim().length == 0) {
				modal_msg('Selection Error', 'Please enter both <b>From Table</b> and <b>To Table</b> values');
			} else {
				$("#result-head").html("<p>Processing request. Please wait...</p>");
/*				$.post(service_def, { api_func:'ADD_CLONE_DEFINITIONS', from_tbl:info_from, to_tbl:info_to}, 
						function (rslt) { console.log(rslt) } );*/
				$.post(service_def,
						{ api_func:'ADD_CLONE_DEFINITIONS', from_tbl:info_from, to_tbl:info_to},
						function(rslt) { 
							// hide the processing msg, then make sure any existing DataTable is gone, then grab the cloned defs from the ADD
							if ($.fn.DataTable.isDataTable ("#srch-tbl-rslt")) { srchdt_remove(); }
							$.post(service_def,
								{api_func:'ADD_SEARCHDD', srch_txt:"", srch_tbl:info_to, srch_col:"" },
									function(rslt) { build_srch_tbl(rslt); }, "json");							
							} );
				$("#result-head").html("<p>Definitions cloned from " + info_from + " to " + info_to + "</p>");
			}
			break;

		default: 
			console.log("The type of search was not recognized: " + misc_pick);
	}
}


function get_defs() {
/*	var msg = document.getElementById("def-incstruc").checked === true ? "It was checked" : "not checked";*/
/*	var msg = $("#def-incstruc").checked === true ? "It was checked" : "not checked";*/
	processing_start();
	// need to destroy the DataTable each time in case they changed the "include structure" option
	setup_data_area();
	
	var chk_flag = document.getElementById("def-incstruc").checked === true ? 1 : 0;
	$("#result-head").html("<p>All current Data Definitions</p>");
	resize_div(".div-srch-rslt", 50);
	$("#searchinfo").removeClass("hidediv");
	$(".div-srch-rslt").removeClass("hidediv")
	// note the DT code build diff - different functions called
	if (chk_flag > 0) {
		// I really, REALLY hate anonymous functions. Note the "trick" to call a REAL-named function for better readabiity, etc
		$.post(service_def,
			{ api_func:'ADD_GETDD_ALL',add_struc:chk_flag },
			function(rslt) { build_srch_tbl_dbstruc(rslt); }, "json");
	} else {
		// I really, REALLY hate anonymous functions. Note the "trick" to call a REAL-named function for better readabiity, etc
		$.post(service_def,
			{ api_func:'ADD_GETDD_ALL',add_struc:chk_flag },
			function(rslt) { build_srch_tbl(rslt); }, "json");
	}

	processing_end();
}


function build_srch_tbl (rsltdata, enable_link = 1, sorttype = 'table/col') {
/*// Misc options in DataTable initialization that were tried - with many headaches and tears
//	scroller: { rowHeight: 26 },
// trying some stripes in table - worked good if run right after a table was initialized, but table repopulate wouldn't
//			$("#srch-tbl-rslt tbody tr:nth-child(odd)").css( { "background-color": "#ffccaa" } );
*/
	// console.log(rsltdata);
	var tblht = $(".div-srch-rslt").height() - 88;
	var tblhtpx = tblht.toString() + "px";
	if (enable_link > 0) { 
		$("#srch-tbl-rslt").removeAttr('width').DataTable( {
		"bInfo": false,
		scrollY: tblhtpx,
		scrollX: true,
		scrollCollapse: true,
		stateSave: true,
		paging: false,		
		"data": rsltdata,
		rowId: 'item_id',
		columns: [
			{ data: "item_id", "width": "40px", "title": "Item ID", className: "q-cent", 
					"render": function (data,type,row,meta) {  return make_item_id_link(data,type,row,meta) } },
			{ data: "table_name", "width": "100px", "title": "Table Name", orderData: 1 },
			{ data: "column_name", "width": "100px", "title": "Column Name", orderData: 2 },
			{ data: "meaning", "width": "370px", "title": "Definition/Meaning", "defaultContent": "", 
					"render" : function ( data, type, row, meta ) { return rend_ell(data, type, row, meta, 150) } },
			{ data: "data_source", "width": "150px", "title": "Data Source", "defaultContent": "" },
			{ data: "update_frequency", "width": "70px", "title": "Update Frequency", "defaultContent": ""  },
			{ data: "security", "width": "100px", "title": "Security Level", "defaultContent": "" },
			{ data: "steward_primary_attuid", "width": "70px", "title": "Steward", className: "q-cent", "defaultContent": "" },
			{ data: "steward_backup_attuids", "width": "100px", "title": "Backup Stewards", "defaultContent": "" },
			{ data: "definition_confidence", "width": "70px", "title": "Definition Confidence", className: "q-cent", "defaultContent": "" },
			{ data: "last_meaning_change", "width": "100px", "title": "Last Change", "defaultContent": "" },
			{ data: "last_change_by", "width": "70px", "title": "Last Changed By", "defaultContent": "" },
			{ data: "inactive", "width": "60px", "title": "Inactive", className: "q-cent", "defaultContent": "", 
				"render" : function ( data, type, row, meta ) { return rend_yn(data,type,row,meta) } },
			{ data: "inactive_date", "width": "100px", "title": "Inactive Date", "defaultContent": "" }
		] } );
		// don't forget, array references are 0-based
		$("#srch-tbl-rslt").DataTable().order( [ 1, 'asc' ], [ 2, 'asc' ] ).draw()
	} else {
		// this building version is for the 'historical' data: so item ID is not unique in this result set
		$("#srch-tbl-rslt").removeAttr('width').DataTable( {
			"bInfo": false,
			scrollY: tblhtpx,
			scrollX: true,
			scrollCollapse: true,
			stateSave: true,
			paging: false,		
			"data": rsltdata,
			rowId: 'item_id',
			columns: [
				{ data: "item_id", "width": "40px", "title": "Item ID", className: "q-cent" },
				{ data: "table_name", "width": "100px", "title": "Table Name" },
				{ data: "column_name", "width": "100px", "title": "Column Name" },
				{ data: "meaning", "width": "370px", "title": "Definition/Meaning", "defaultContent": "", 
						"render" : function ( data, type, row, meta ) { return rend_ell(data, type, row, meta, 150) } },
				{ data: "data_source", "width": "150px", "title": "Data Source", "defaultContent": "" },
				{ data: "update_frequency", "width": "70px", "title": "Update Frequency", "defaultContent": ""  },
				{ data: "security", "width": "100px", "title": "Security Level", "defaultContent": "" },
				{ data: "steward_primary_attuid", "width": "70px", "title": "Steward", className: "q-cent", "defaultContent": "" },
				{ data: "steward_backup_attuids", "width": "100px", "title": "Backup Stewards", "defaultContent": "" },
				{ data: "definition_confidence", "width": "70px", "title": "Definition Confidence", className: "q-cent", "defaultContent": "" },
				{ data: "last_meaning_change", "width": "100px", "title": "Last Change", "defaultContent": "" },
				{ data: "last_change_by", "width": "70px", "title": "Last Changed By", "defaultContent": "" },
				{ data: "inactive", "width": "60px", "title": "Inactive", className: "q-cent", "defaultContent": "", 
					"render" : function ( data, type, row, meta ) { return rend_yn(data,type,row,meta) } },
				{ data: "inactive_date", "width": "100px", "title": "Inactive Date", "defaultContent": "" } 
			] } );
		if (sorttype = 'chgdate') {
			$('#srch-tbl-rslt').DataTable().order([10, 'desc']).draw();
		} else {
			$("#srch-tbl-rslt").DataTable().order( [ 1, 'asc' ], [ 2, 'asc' ] ).draw();
		}
	}
	// set up a click so that if they click on the meaning col, the movable pop-up appears.
	var tmp_tbl = $("#srch-tbl-rslt").DataTable();
	$('#srch-tbl-rslt tbody').on( 'click', 'td', function () { 
		var rowidx = tmp_tbl.cell( this ).index().row;
		// only want to do the pop-up if the "ID" column was NOT clicked
		if (tmp_tbl.cell( this ).index().column > 0) {
			// note: the 'rows.data' value is a comlex object. element 0 in that set is the json row of data values - can reference by key name
			var refinfo = $("#srch-tbl-rslt").DataTable().rows(rowidx).data();
			// note: passing 0 as 2nd parameter causes date/time (3rd parm) to be displayed in heading instead of ID value
			var popidval = (enable_link > 0) ? refinfo[0].item_id : 0
			pop_desc(refinfo[0].meaning, popidval, refinfo[0].last_meaning_change);
		}
	} );
}


function build_srch_tbl_dbstruc (rsltdata, enable_link = 1, sorttype = 'table/col') {
	/*  This is mostly a copy of build_srch_tbl(), so have to worry about multiple code maintence. Oh well. But here we
		want the database structure info to also be in the resulting data display. */
	var tblht = $(".div-srch-rslt").height() - 88;
	var tblhtpx = tblht.toString() + "px";
 
	$("#srch-tbl-rslt").removeAttr('width').DataTable( {
	"bInfo": false,
	scrollY: tblhtpx,
	scrollX: true,
	scrollCollapse: true,
	stateSave: true,
	paging: false,		
	"data": rsltdata,
	rowId: 'item_id',
	columns: [
		{ data: "item_id", "width": "40px", "title": "Item ID", className: "q-cent", 
				"render": function (data,type,row,meta) {  return make_item_id_link(data,type,row,meta) } },
		{ data: "table_name", "width": "100px", "title": "Table Name", orderData: 1 },
		{ data: "column_name", "width": "100px", "title": "Column Name", orderData: 2 },
		{ data: "meaning", "width": "370px", "title": "Definition/Meaning", "defaultContent": "", 
				"render" : function ( data, type, row, meta ) { return rend_ell(data, type, row, meta, 150) } },
		{ data: "data_source", "width": "150px", "title": "Data Source", "defaultContent": "" },
		{ data: "update_frequency", "width": "70px", "title": "Update Frequency", "defaultContent": ""  },
		{ data: "security", "width": "100px", "title": "Security Level", "defaultContent": "" },
		{ data: "steward_primary_attuid", "width": "70px", "title": "Steward", className: "q-cent", "defaultContent": "" },
		{ data: "steward_backup_attuids", "width": "100px", "title": "Backup Stewards", "defaultContent": "" },
		{ data: "definition_confidence", "width": "70px", "title": "Definition Confidence", className: "q-cent", "defaultContent": "" },
		{ data: "last_meaning_change", "width": "100px", "title": "Last Change", "defaultContent": "" },
		{ data: "last_change_by", "width": "70px", "title": "Last Changed By", "defaultContent": "" },
		{ data: "inactive", "width": "60px", "title": "Inactive", className: "q-cent", "defaultContent": "", 
			"render" : function ( data, type, row, meta ) { return rend_yn(data,type,row,meta) } },
		{ data: "inactive_date", "width": "100px", "title": "Inactive Date", "defaultContent": "" },
		{ data: "table_schema", "width": "80px", "title": "Table Schema" },
		{ data: "data_type", "width": "100px", "title": "Data Type" },
		{ data: "max_length", "width": "60px", "title": "Max Length" },
		{ data: "is_nullable", "width": "70px", "title": "Nullable" },
		{ data: "default_val", "width": "90px", "title": "Default Value" },
		{ data: "numeric_precision", "width": "90px", "title": "Numeric Precision" },
		{ data: "datetime_precision", "width": "110px", "title": "Datetime Precision" }
	] } );
	// don't forget, array references are 0-based
	if (sorttype = 'chgdate') {
		$('#srch-tbl-rslt').DataTable().order([10, 'desc']).draw();
	} else {
		$("#srch-tbl-rslt").DataTable().order( [ 1, 'asc' ], [ 2, 'asc' ] ).draw();
	};

};

function make_link_user_edit (data, type, row, meta, tableselect) {
	// tableselect should be of form '#datatable-selector'
	if (type === 'display') {
		var idstr = data;
		var tblid = "'" + tableselect + "'";
		var linkret = '<a href="javascript:;" onclick="user_edit_data(' + idstr + ', ' + tblid + ')">' + row.fname.trim() + ' ' + row.lname.trim() + '</a>';
		// console.log(row.table_name + " - " + row.column_name);
	} else {
		linkret = data;
	};
	return linkret;
};

function user_edit_cancel() {
	$('.user-edit').addClass('hidediv');
	$('#modal-overlay').addClass('hidediv');
};

function user_edit_data(p_itemid, p_dtref, editmode = "E") {
	// p_itemid = item being edited, p_dtref = reference to DataTable, editmode = E for editing / A for adding
	$("#modal-overlay").removeClass("hidediv");
	$(".user-edit").removeClass("hidediv");
	// try to center the window vertically
	pop_div_center(".user-edit");

	$("#user-id").val(p_itemid);
	$("#edit-mode-user").val(editmode);
	$("#user-data-table").val(p_dtref);
	var p_itemid_sel = '#' + p_itemid.toString()
	var trdata = $(p_dtref).DataTable().row(p_itemid_sel).data();
/*	console.log(trdata);*/

	if (editmode=="E") {
		$("#user-fname").val(trdata.fname);
		$("#user-lname").val(trdata.lname);
		$("#user-email").val(trdata.email);
		$("#user-phone").val(trdata.phone);
		$("#user-phone-ext").val(trdata.phone_ext);
		$("#user-role").val(trdata.role);

		$("#user-delete-btn").removeClass('hidevar');
	} else {
		$("#user-id").val(-1);
		$("#user-fname").val('');
		$("#user-lname").val('');
		$("#user-email").val('');
		$("#user-phone").val('');
		$("#user-phone-ext").val('');
		$("#user-role").val('');
		$("#user-delete-btn").addClass('hidevar');
	};
};


function make_item_id_link (idval, type, row, meta) {
	if (type === 'display') {
		var idstr = idval;
		var tblid = "'#srch-tbl-rslt'";
		var linkret = '<a href="javascript" onclick="ed_data(' + idstr + ', ' + tblid + ')">' + idstr + '</a>';
		// console.log(row.table_name + " - " + row.column_name);
	} else {
		linkret = data;
	};
	return linkret;
};


function ed_data(p_itemid, p_dtref, editmode = "E") {
	// p_itemid = item being edited, p_dtref = reference to DataTable, editmode = E for editing / A for adding
	$("#modal-overlay").removeClass("hidediv");
	$(".edit-win").removeClass("hidediv");
	// try to center the window vertically
	var availht = $(window).height();
	var edht = $(".edit-win").height();
	var newtop = Math.max(( (availht - edht) / 2 ), 2);
	$(".edit-win").css({top: newtop.toString() + 'px'});

	$("#e-item_id").val(p_itemid);
	$("#e-editmode").val(editmode);
	$("#e-dt-ident").val(p_dtref);
	var p_itemid_sel = '#' + p_itemid.toString()
	var trdata = $(p_dtref).DataTable().row(p_itemid_sel).data();
/*	console.log(trdata);*/
	$("#e-table_name").val(trdata.table_name);
	$("#e-column_name").val(trdata.column_name);
	$("#e-freq").val(trdata.update_frequency);
	$("#e-meaning").val(trdata.meaning);
	$("#e-steward").val(trdata.steward_primary_attuid);
	$("#e-steward_back").val(trdata.steward_backup_attuids);
	$("#e-source").val(trdata.data_source);
	$("#e-def_conf").val(trdata.definition_confidence);
	$("#e-security").val(trdata.security);
	if (editmode="E") {
		$("#item-val").text(p_itemid);
		$("#e-table_name").prop('readonly', true);
		$("#e-table_name").css({"background-color": "#dddddd"});
		$("#e-column_name").prop('readonly', true);
		$("#e-column_name").css({"background-color": "#dddddd"});
		$("#ew-but-delete").removeClass('hidevar');
	} else {
		$("#item-val").text('-Creating new item-');
		$("#e-table_name").prop('readonly', false);
		$("#e-table_name").css({"background-color": "#ffffff"});
		$("#e-column_name").prop('readonly', false);
		$("#e-column_name").css({"background-color": "#ffffff"});
		$("#ew-but-delete").addClass('hidevar');
	};
};

function ew_save_edit() {
	// this function is specifically for the .edit-win class (a pop-up). Thus the hard-coded selectors
	var t_itemid = $("#e-item_id").val();
	var t_itemid_sel = "#" + t_itemid.toString();
	var tblid = $("#e-dt-ident").val();
	var trdata = $(tblid).DataTable().row(t_itemid_sel).data();
	var tbl_nm = $("#e-table_name").val();
	var col_nm = $("#e-column_name").val();
	var allow_save = 0;
	trdata.steward_primary_attuid = $("#e-steward").val();
	trdata.meaning = $("#e-meaning").val();
	trdata.update_frequency = $("#e-freq").val();
	trdata.definition_confidence = $("#e-def_conf").val();
	trdata.security = $("#e-security").val();
	trdata.data_source = $("#e-source").val();
	trdata.steward_backup_attuids = $("#e-steward_back").val();

	// do some checking before allowing Save
	if (t_itemid > 0 || (tbl_nm.trim().length > 0 && col_nm.trim().length > 0)) {
		// OK, to do the save
		allow_save = 1;
	} else {
		modal_msg('Entry required', 'An ID or a table/column pair is required before data can be saved',0,"#ffbbbb");
	};

	if (allow_save > 0) { 
		// do the post call to invoke the ADD api to save data - add_putdd_item(...)
		// to pass table/col, but should not be needed if have ID
		//		p_tblname:$('#e-table_name').val(), p_colname:$('#e-column_name').val() 
		$.post(service_def,
				{api_func:'ADD_PUTDD_ITEM',p_item_id:t_itemid,p_meaning:trdata.meaning,p_data_source:trdata.data_source,
							p_update_frequency:trdata.update_frequency, p_security:trdata.security, 
							p_steward:trdata.steward_primary_attuid,p_steward_backups:trdata.steward_backup_attuids,
							p_definition_confidence:trdata.definition_confidence, p_tbl:tbl_nm, p_col:col_nm},
				function (rslt) {
					// console.log(rslt);
				});
		$(tblid).DataTable().row(t_itemid_sel).invalidate();
		$(tblid).DataTable().row(t_itemid_sel).draw('page');
		kill_edit_win();
	};
};

function del_item_msg (deltype, item_idref, dt_ref) {
/*	the deletion type can be either 'single' or 'multiple' (just checking single). The idea is this function can take care of deleting
	either a single record or a whole range of records. if 'single' is passed, the 2nd parameter is the identifier that has the val() to delete*/
	var delwin = $("#ew-del-confirm");
	var newtop = Math.max(( ($(window).height() - delwin.height()) / 2 ), 2);
	var newleft = Math.max(( ($(window).width() - delwin.width()) / 2 ), 2);
	delwin.css({top: newtop.toString() + 'px'});
	delwin.css({left: newleft.toString() + 'px'});
	$('#modal-overlay2').removeClass('hidediv');
	$('#ew-del-confirm').removeClass('hidediv');
	$("#datatable-ref").val(dt_ref);
	if (deltype == 'single') {
		$("#del-id").val($(item_idref).val());
	} else {
		$("#del-id").val(-1);
	};
};

function delete_edit_item_process (do_delete) {
	$('#ew-del-confirm').addClass('hidediv');
	$('#modal-overlay2').addClass('hidediv');
	if (do_delete > 0) {
		var tdelval = $("#del-id").val();
		// IMPORTANT!!! when deleting a value in a DataTable that has a "rowId" assigment, must prefix "#" on the value passed to .row()
		var tdtdelid = "#" + tdelval;
		var strref = $("#datatable-ref").val();
		var delreason = $("#ew-del-confirm-reason").val();
		if ($("#del-id").val() > 0) {
			// Only a single ID value is to be deleted, so delete it.
			var DT_update = $(strref);
			$.post(service_def, 
					{api_func:'ADD_DELETEDD_ITEM', del_id:tdelval, del_text:delreason}, 
					function(rslt) {
							/*console.log(rslt);*/
							var oTable = $($(strref).val()).DataTable();
							oTable.row(tdtdelid).remove().draw(false);
							kill_edit_win();
							});
		} else {
			// loop through the datatable reference, grab each item_id - aka rowid of DataTable - and call the delete.
			console.log('not doing a single item deletion');
		};
	};
};

function show_ed_div () {
	console.log("called show_ed_div");
	// make sure the right stuff is hidden
	$("#e-special").addClass('hidediv');
	$(".edit-win").removeClass("hidediv");
};
function kill_edit_win() {
	$(".edit-win").addClass("hidediv");
	$("#modal-overlay").addClass("hidediv");
};

function rend_ell(data, type, row, meta, p_trim_len) {
	// mainly used for DataTables rendering
	var retstr;
	if (data === null) {
		retstr = "";
	} else {
		if (type === 'display' && data.length > p_trim_len) {
			retstr = '<span>' + data.substr(0,147) + '...</span>'; 
		} else {
			retstr = data;
		}
	}
	return retstr;
};

function rend_yn(data, type, row, meta) {
	// mainly for rendering a 0/1 to Yes/No in a DataTable
	var retstr;
 	if (type === 'display' && data > 0) {
			retstr = '<span>Yes</span>';
	} else {
		retstr = '<span>No</span>';
	}
	return retstr;
};


function destroy_datatable(dtdivref) {
	// destroys the passed datatable. Note the selection is as per jQuery - ".<name>" selects by class, "#<name>" selects by id
	if ( $.fn.DataTable.isDataTable (dtdivref)) {
		$(dtdivref).DataTable().clear();
		$(dtdivref).DataTable().destroy();
		$(dtdivref).html('');
	};
};

function resize_div (div_ident, bump_t = 0, bump_b = 0) {
	// ******* DEPRECATED - DO NOT USE THIS

	//    sets the height of a div to keep it all on-screen with scrolling inside div
	// 	div_ident: the div whose 'height' to set (jQuery form), bump_t and _b: values to allow more spacing
	// 	e.g. an expected header above a Div, extra space at bottom of div for other objects, etc
	// 	note, since div_ident will be used "as is" it could be a class identifier or an ID identifier, etc
	// 	Important: div class .maincontent is expected to be the parent of all these resizes, so the top margin is already set
	var nmainht = $("#main-heading").height();
	var nmenht = $('#am-topmenu').height();
		var calcht = nmainht - nmenht - bump_t - bump_b - 10;
		$(div_ident).css({"height":calcht});
	};

function resize_maindiv (divpick) {
  //   purpose: to resize a primary div in the app. Recall there is a left menu bar, then sometimes a top menu bar in the 
  // app. This function accounts for those, and resizes the passed div to the 'rest' of the screen
  // divpick - a string that is a jquery selector to select the div to be resized.
	//
	// recall, the global variable dataobj.maindivheight and .maindivwidth were set at the startup. Use those for this resizing
  $(divpick).height(dataobj.maindivheight);
  $(divpick).width(dataobj.maindivwidth);
};

function objarrsort(prop) {
  return function(a,b) {
    let retval = 0;
    if (a[prop] > b[prop]) {
      retval = 1;
    } else if (a[prop] < b[prop]) {
      retval = -1
    };
    return retval;
  };
};

function get_steward_list() {
	var tmptext1 = 'GET AVAILABLE';
	var sel_obj = $("#dropsel-steward");
		$.post(service_def,
			{api_func:'ADD_GETDD_BY_STEWARD',steward_id:tmptext1},
			function(rslt) { build_stew_sel(rslt,sel_obj); }, "json");
};

function build_stew_sel (jsonlist, htmlselobj) {
	// clear out the existing options first
	document.getElementById("dropsel-steward").options.length=0;
	// make sure the 'blank' option is listed first
	$(htmlselobj).append('<option value=" "> </option>');
	$.each(jsonlist, function(key, val) {
		if (val != null && val.trim() != '') {
			$(htmlselobj).append('<option value="' + val + '">' + val + '</option>');
		}
	});
};

function get_table_list() {
	// want to build 2 selection boxes, so hold on to return data of post. Thus, doing function inside function
	get_table_list_work();

	function get_table_list_work() {
		$.post(service_def, 
				{ api_func:'UTIL TABLE NAMES' }, 
				function (rslt) { 
					populate_cloneopts(rslt);
				}, "json");

	}

};


function modal_msg(ctitle, cmsg, expandv = 0, hdbg = "#bbffbb") {
	var diaght = 300;
	var diagwid = $(".modal-dialog").width();
	diaght = diaght + expandv;
	$(".modal-dialog").height(diaght);
	$("#m-hd-txt").text(ctitle);
	$("#modal-body").html(cmsg);
	var calctop = ($(window).height() - diaght) / 2;
	var calcleft = ($(window).width() - diagwid) / 2;
	$(".modal-dialog").css({ "top":calctop.toString()+'px', "left":calcleft.toString()+'px' });
	$("#modal-head").css({ "background-color": hdbg });
	
	$("#modal-overlay").removeClass('hidediv');
	$(".modal-dialog").removeClass('hidediv');

};

function processing_start (disptext = "Processing...") {
	var statmsg = $("#pop-msg");
	statmsg.text(disptext);
/*	// after a bunch of messing around with positioning, it seems to look best to just set the initial position (css) and leave it
	var pos_tmp = $("#menu-sep").position();
	statmsg.top = pos_tmp.top + $("#menu-sep").height() + 8 ;
	statmsg.left = ($(window).width() - statmsg.width) / 2;
	statmsg.left = 10;*/
	statmsg.removeClass('hidediv');
//	console.log('top: ' + statmsg.top.toString() + ', left: ' + statmsg.left.toString());
};
function processing_end () {
	$('#pop-msg').addClass('hidediv');
};

function setup_data_area() {
	// reposition the main section based on how tall the options area is
	var posobj = $(".maincontent").offset();
	var calcmainht = $(window).height() - posobj.top - 10;
	$(".maincontent").css({"height":calcmainht});
	resize_div(".div-srch-rslt", 50);
	srchdt_remove();
};

function pop_desc(text_str, id_str = 0, dateval) {
	var moddate = new Date();
	var disphdtext = "Data Item Description";
	if (id_str > 0) {
		disphdtext += " (ID: " + id_str.toString() + ")";
	} else {
		disphdtext += " (modified: " + dateval.toString() + ")"; 
	}
	// if the movable div is not yet visible, set it to a starting location. otherwise leave it where it is
	if ($("#pop-mov1").hasClass('hidediv')) {
		$("#pop-mov1").css({"top": "150px", "left": "600px"});
	}
	$("#pop-hd-text").text(disphdtext);
	$("#pop-content").html('<p>' + text_str.replace(/\r?\n|\r/g, "<br>") + '</p>');
/*	$("#pop-content").val(text_str);*/
	
	$("#pop-mov1").removeClass('hidediv');
	draggable_div(document.getElementById(("pop-mov1")));
};


function modal_close() {
	$("#modal-overlay").addClass('hidediv');
	$(".modal-dialog").addClass('hidediv');
};

function pop_mov1_close () {
	$("#pop-mov1").addClass('hidediv');
};

function draggable_div (divid) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	// this was the jQuery way, not sure it was compatible: var pop_hd = $("#"+divid+"pop-head");
	var pop_hd = document.getElementById(("pop-head"));
	if (pop_hd) {
		pop_hd.onmousedown = drag_mouse_down;
	} else {
		divid.onmousedown = drag_mouse_down;
	}

	function drag_mouse_down (evnt) {
		evnt = evnt || window.event;
		pos3 = evnt.clientX;
		pos4 = evnt.clientY;
		document.onmouseup = drag_div_close;
		document.onmousemove = drag_div_move;
	};
	
	function drag_div_move (evnt) {
		evnt = evnt || window.event;
		pos1 = pos3 - evnt.clientX;
		pos2 = pos4 - evnt.clientY;
		pos3 = evnt.clientX;
		pos4 = evnt.clientY;
		divid.style.top = (divid.offsetTop - pos2) + "px";
		divid.style.left = (divid.offsetLeft - pos1) + "px";
	};
	
	function drag_div_close () {
		document.onmouseup = null;
		document.onmousemove = null;
	};
};

function pop_div_center(divselector, outerdiv = null) {
	// this function takes a passed "div selector" (hopefully an "id" - like "#user-edit") and will try
	// to center it within the boundaries of the outerdiv, but if the outerdiv is not specified it will
	// center in regards to the overall window. Note: CSS properties still do apply (aka position: fixed)
	contref = (outerdiv == null) ? window : outerdiv;
	var availht = $(contref).height();
	var edht = $(divselector).height();
	var newtop = Math.max(( (availht - edht) / 2 ), 2);
	var availwd = $(contref).width();
	var edwd = $(divselector).width();
	var newleft = Math.max(( (availwd - edwd) / 2 ), 2);
	$(divselector).css({top: newtop.toString() + 'px'});
	$(divselector).css({left: newleft.toString() + 'px'});

};

function color_help() {
	$("#clrbtn").css({'background-color': $("#clrbox").val()});
};

function modal_test() {
	// note: putting the call to the modal message inside the post makes sure I got the info from the post. And also, it means chkstr now has the value
	$.post(service_def,
			{api_func:'GET_LAST_CALL'}, 
			function (rslt) {
				chkstr = '<p>' + rslt + '</p>';
				modal_msg('My Test Message', 'Did it <b>work</b>?' + '<p>' + service_def + '</p>' + chkstr);				
			});	
};

function movable_test () {
	$("#pop-hd-text").text('Movable box');
	$("#pop-content").html('<p>Move the box by dragging the heading around</p><p>Maybe this can be standardized</p>');
	$("#pop-mov1").removeClass('hidediv');
	draggable_div(document.getElementById(("pop-mov1")));
};

function loadhtmls() {
  //   purpose: to load the html files that were split out for readability. It is important these get loaded ASAP
  // because various code makes sections visible and such right away. Implement this by promises
  // htmlload('.dashboard-sect', 'htmlloads/dashboard-sect-load.html');
  htmlload('.user-edit', 'htmlloads/user-edit-load.html');
	htmlload('.course-attendee', 'htmlloads/bio-total-load.html');
	htmlload('.course-formation-group-mgmt', 'htmlloads/formation-grp-mgmt.html');
  
};

function htmlload(divelem, fileref) {
  //   the divelem is a selector to load the html file into e.g. "#divid" (or ".thisitem"). Note that 'classes' may have to
  // be used in defining divs - otherwise trying to apply the 'hidediv' class will not override the display of an "id" div.
  // the fileref is the string representing where the file is from, e.g. "htmlloads/dashboard-load.html"
  // make sure the data has not already been loaded, some weird crap with timing here
  // console.log($(divelem).html().length);
  if ($(divelem).html().length < 100) {
    $(divelem).load(fileref);
    console.log('did load - ' + divelem + ' - ' + fileref);
  } else {
    console.log('div data already loaded - ' + divelem);
  };
};
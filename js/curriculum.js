
function build_unit_tbl (rsltdata) {
  var tblht = ($(".curr-sect-units").height() - $('#unit-list-wrap').position().top) + 'px';
  // console.log(tblht);
	// var tblhtpx = tblht.toString() + "px";
	// $("#user-list-tbl").removeAttr('width').DataTable( {
	$("#unit-list-tbl").DataTable( {
	"bInfo": false,
	"bFilter": false,
	autoWidth: true,
	responsive: true,
	scrollY: tblht,
	scrollX: true,
	scrollCollapse: true,
	stateSave: true,
	paging: false,
	"data": rsltdata,
	rowId: 'id',
	// note the passing of 'id' as the second column - the reason is for the render, and the resulting link set up
	columns: [
		{ data: "id", "width": "20px", "title": "ID", className: "q-cent" }, 
		{ data: "id", "width": "350px", "title": "Title", orderData: 1, 
			"render" : function ( data, type, row, meta ) { return make_link_unit_edit(data, type, row, meta, "#unit-list-tbl"); } },
		{ data: "module_category", "width": "350px", "title": "Category" },
		{ data: "expected_hrs", "width": "90px", "title": "Expected Duration", "defaultContent": "" },
		{ data: "sex_focus", "width": "70px", "title": "Sex Focus", "defaultContent": "" }
	] }
	);
}


function make_link_unit_edit (data, type, row, meta, tableselect) {
	// tableselect should be of form '#datatable-selector'
	if (type === 'display') {
		var idstr = data;
		var tblid = "'" + tableselect + "'";
		var linkret = '<a href="javascript:;" onclick="unit_edit_data(' + idstr + ', ' + tblid + ')">' + row.title + '</a>';
		// console.log(row.table_name + " - " + row.column_name);
	} else {
		linkret = data;
	};
	return linkret;
};

function unit_edit_data() {
	console.log('this is the data editing of units');
};


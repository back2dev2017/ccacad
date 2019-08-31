

// various useful, testing, explanatory JS and JQuery examples

function misc1 () {
/*after a DataTable has been created*/ 
	var tmp_tbl = $("#srch-tbl-rslt").DataTable();
	$('#srch-tbl-rslt tbody').on( 'click', 'td', function () {
	    console.log( 'Clicked on cell in visible column: '+tmp_tbl.cell( this ).index().columnVisible );
	    console.log( 'The actual index of the column was: '+tmp_tbl.cell( this ).index().column );
	    console.log( 'The row index of item clicked was: '+tmp_tbl.cell( this ).index().row );
	    var rowidx = tmp_tbl.cell( this ).index().row;
		// note: the 'rows.data' value is a comlex object. element 0 in that set is the json row of data values - can reference by key name
	    var refinfo = $("#srch-tbl-rslt").DataTable().rows(rowidx).data();
	    console.log(refinfo[0].meaning);
	} );
}

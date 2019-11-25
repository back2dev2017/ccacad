
*-- misc code to help program javacript, php, whatever. so much typing in those languages. So these code snippets can
*-- take text on the clipboard and turn into code, etc.


*-- these should never be invoked as functions, just copy/paste code, or right-click run

FUNCTION js_dom_to_data
*-- reverses data assignments to DOM elements into data assignments from DOM elements
*-- expects form of $('<dom item>').val(

cx = _cliptext
nlines = ALINES(atmp, cx, 1+4)
cresult = ''
cother = ''
FOR ni = 1 TO nlines
	tline = ALLTRIM(STRTRAN(atmp[ni], CHR(9), ''))
	IF LEFT(tline, 1) == '$'
		npos = ATC('val(', tline)
		cvar = STRTRAN(STRTRAN(SUBSTR(tline, npos + 4), ')', ''), ';', '')
		npos = ATC('.', tline)
		cdom = SUBSTR(tline, 1, npos) + 'val()'
		cresult = cresult + cvar + ' = ' + cdom + ';' + CHR(13)
	ELSE
		IF LOWER(LEFT(tline,2)) != 'if' AND LEFT(tline,1) != '}'
			tline = STRTRAN(STRTRAN(tline, '.toLowerCase()', ''), '.toUpperCase()', '')
			npos = ATC('==', tline)
			cvar = ALLTRIM(SUBSTR(tline, 1, npos-1))
			npos = ATC('?', tline)
			npos1 = ATC(':', tline)
			tmpstr = SUBSTR(tline, npos + 1, npos1 - npos - 1)
			npos = ATC('.',tmpstr)
			cdom1 = ALLTRIM(SUBSTR(tmpstr, 1, npos - 1))
			cfinal = cvar + ' = ' + cdom1 + ".prop('checked') ? 'Y' : 'N';"
			cresult = cresult + cfinal + CHR(13)
		ENDIF
	ENDIF
ENDFOR
_cliptext = cresult

RETURN

FUNCTION get_just_vars
*-- pulls just javascript variables, creates param names for them (adds p_) and sets up jquery post


cstart = "$.post(service_def, " + CHR(13) + ;
		'{ api_func: "PUT CALL METHOD HERE"' ;

cend = '}, ' + CHR(13) + ;
		'function (rslt) {' + CHR(13) + ;
		'	window.dataobj.users = rslt; ' + CHR(13) + ;
		'}, "json" );'

cprefixremove = 'tobj.'
cx = _cliptext
nlines = ALINES(atmp, cx, 1+4)
clist = 'blahblahblahbla'
ncount = 1
FOR ni = 1 TO nlines
	tline = STRTRAN(ALLTRIM(atmp[ni]),CHR(9),'')
	cvar = ALLTRIM(SUBSTR(tline, 1, ATC('=', tline) - 1))
	pvar = 'p_' + STRTRAN(cvar, cprefixremove, '')
	IF LEN(clist) > 45
		cstart = cstart + ', ' + pvar + ':' + cvar + ', ' + CHR(13)
		clist = ''
		ncount = 0
	ELSE
		cstart = cstart + IIF(ncount == 0, '', ', ') + pvar + ':' + cvar
		clist = clist + ', ' + pvar + ':' + cvar
		ncount = ncount + 1
	ENDIF
ENDFOR
cfinal = cstart + cend
_cliptext = cfinal

RETURN

*---------------------
FUNCTION make_php_var_list
cx = _cliptext
nlines = ALINES(atmp, cx, 1+4)
cprefixremove = 'tobj.'
phpstmnt = ''
FOR ni = 1 TO nlines
	tline = STRTRAN(ALLTRIM(atmp[ni]),CHR(9),'')
	cvar = ALLTRIM(SUBSTR(tline, 1, ATC('=', tline) - 1))
	pvar = 'p_' + STRTRAN(cvar, cprefixremove, '')
	phpvar = '$v_' + SUBSTR(pvar, 3)
	phpstmnt = phpstmnt + phpvar + " = isset($_POST['" + pvar + "']) ? $_POST['" + pvar + "'] : null;" + CHR(13)
ENDFOR 
_cliptext = phpstmnt;

RETURN

*----------------------------------
FUNCTION make_sp_call_phparray
*-- highlight the variable list in the PHP code
cx = _cliptext
nlines = ALINES(atmp, cx, 1+4)
arrlist = ''
FOR ni = 1 TO nlines
	tline = STRTRAN(ALLTRIM(atmp[ni]),CHR(9),'')
	cvar = ALLTRIM(SUBSTR(tline, 1, ATC('=', tline) - 1))
	arrlist = arrlist + IIF(EMPTY(arrlist), '', ',') + cvar
ENDFOR 
_cliptext = arrlist

*-- create list of '$x' for the php param
*-- highlight the variable list in php code
cx = _cliptext
nlines = ALINES(atmp, cx, 1+4)
parmlist = ''
FOR ni = 1 TO nlines
	parmlist = parmlist + IIF(EMPTY(parmlist),'',',') + '$' + ALLTRIM(STR(ni))
ENDFOR 
_cliptext = parmlist


RETURN
*------------------

FUNCTION pg_sp_parms
*-- setting up pg parms of stored proc
*-- highlight the 'array' variable list in the php call
cx = _cliptext
nlines = ALINES(atmp, cx, 1+4, ',')
parmlist = ''
ncount = 0
FOR ni = 1 TO nlines
	citem = ALLTRIM(STRTRAN(STRTRAN(atmp[ni], CHR(9), ''), CHR(13), ''))
	IF ncount > 1
		parmlist = parmlist + 'p_' + SUBSTR(citem, 4) + ' <type> DEFAULT NULL :: <type>, ' + CHR(13)
		ncount = 0
	ELSE
		parmlist = parmlist + 'p_' + SUBSTR(citem, 4) + ' <type> DEFAULT NULL :: <type>, '
		ncount = ncount + 1
	ENDIF
ENDFOR
_cliptext = parmlist

RETURN


*----------------------

FUNCTION get_just_params

cx = _cliptext
cx = STRTRAN(STRTRAN(STRTRAN(STRTRAN(STRTRAN(STRTRAN(cx, CHR(13), ''), CHR(9), ''), 'text', ''), 'NULL', ''), 'DEFAULT', ''), '  ', '')
cx = STRTRAN(STRTRAN(STRTRAN(STRTRAN(STRTRAN(STRTRAN(cx, 'NULL', ''), '::'), 'DEFAULT', ''), 'text', ''), 'bigint', ''), CHR(9), '')
cx = STRTRAN(STRTRAN(STRTRAN(STRTRAN(STRTRAN(cx, ' date', ''), 'integer', ''), 'smallint', ''), ' ', ''), ' ', '')
nlines = ALINES(atmp, cx, ',')
*!*	WAIT ALLTRIM(STR(nlines)) window
=ASORT(atmp)

crslt = ''
FOR ni = 1 TO nlines
	crslt = crslt + CHR(13) + atmp[ni]
ENDFOR
_cliptext = crslt


*-- sorting some code lines
cx = _cliptext
cx = STRTRAN(cx, CHR(9), '')
nlines = ALINES(atmp, cx, 1+4)
=ASORT(atmp)
cnew = ''
FOR ni = 1 TO nlines
	cnew = cnew + atmp[ni] + CHR(13)
ENDFOR
_cliptext = cnew

*-- sorting variable names - separated by commas - kind of thing
cx = _cliptext
nlines = ALINES(atmp, STRTRAN(STRTRAN(cx, CHR(13), ''),CHR(9), ''), 1+4, ',')
=ASORT(atmp)
cnew = ''
FOR ni = 1 TO nlines
	cnew = cnew + atmp[ni] + CHR(13)
ENDFOR
_cliptext = cnew

RETURN


*---------------------------------------
FUNCTION make_sp_local_insert_list
*-- to create the field list for inserting updating
*-- highlight the parms passed to the stored proc - assumes all parms start with 'p_'

cx = _cliptext
cx = STRTRAN(STRTRAN(cx, CHR(9), ''), CHR(13), '')
cx = STRTRAN(STRTRAN(cx, " DEFAULT NULL :: bigint", ''), " DEFAULT NULL :: smallint", '')
cx = STRTRAN(STRTRAN(cx, " DEFAULT NULL :: integer", ''), " DEFAULT NULL :: date", '')
cx = STRTRAN(STRTRAN(cx, " DEFAULT NULL :: date", ''), " DEFAULT NULL :: text", '')
cx = STRTRAN(STRTRAN(STRTRAN(STRTRAN(cx, ' text', ''), ' bigint', ''), ' integer', ''), ' smallint', '')
cx = STRTRAN(cx, ' date', '')
cx = STRTRAN(cx, ' ', '')
nlines = ALINES(atmp,cx,1+4,',')
=ASORT(atmp)
cfldstr = ''
cvalstr = ''
ncount = 0
FOR ni = 1 TO nlines
	cparm = ALLTRIM(atmp[ni])
	IF ncount > 3
		cfldstr = cfldstr + SUBSTR(cparm, 3) + ', ' + CHR(13)
		cvalstr = cvalstr + cparm + ', ' + CHR(13)
		ncount = 0
	ELSE
		cfldstr = cfldstr + SUBSTR(cparm, 3) + ', '
		cvalstr = cvalstr + cparm + ', '
		ncount = ncount + 1
	ENDIF
ENDFOR

cfinal = '(' + cfldstr + ') ' + CHR(13) + "VALUES " + CHR(13) + '(' + cvalstr + ')'
_cliptext = cfinal

*------------------
*-- create "update" type syntax - update... set field = varname....
*-- highlight the parameter list into the stored proc

cx = _cliptext
cx = STRTRAN(STRTRAN(cx, CHR(9), ''), CHR(13), '')
cx = STRTRAN(STRTRAN(cx, " DEFAULT NULL :: bigint", ''), " DEFAULT NULL :: smallint", '')
cx = STRTRAN(STRTRAN(cx, " DEFAULT NULL :: integer", ''), " DEFAULT NULL :: date", '')
cx = STRTRAN(STRTRAN(cx, " DEFAULT NULL :: date", ''), " DEFAULT NULL :: text", '')
cx = STRTRAN(STRTRAN(STRTRAN(STRTRAN(cx, ' text', ''), ' bigint', ''), ' integer', ''), ' smallint', '')
cx = STRTRAN(cx, ' date', '')
cx = STRTRAN(cx, ' ', '')
nlines = ALINES(atmp,cx,1+4,',')
=ASORT(atmp)
cstr = ''
cfn = ''
ncount = 0
FOR ni = 1 TO nlines
	cparm = ALLTRIM(atmp[ni])
	cfn = SUBSTR(cparm, 3)
	IF ncount > 1
		cstr = cstr + cfn + ' = p_' + cfn + ', ' + CHR(13)
		ncount = 0
	ELSE
		cstr = cstr + cfn + ' = p_' + cfn + ', '
		ncount = ncount + 1
	ENDIF
ENDFOR

cfinal = 'UPDATE <table_name>' + CHR(13) + ;
		'SET ' + cstr + CHR(13) + ;
		'<need_where_clause>'
_cliptext = cfinal

RETURN
*-----------------------------------
*-- checking parame list in storec proc to php calling code
FUNCTION checking_sp_params_with_post_with_php_pg_query_params

*-- NOTE: cannot just 'run' this code - multiple copy/pastes

*-- highlight/copy the sql stored proc param list
sqlcx = _cliptext

*-- highlight/copy the php parameter list - aka what is in the 'array()' call
cphp = _cliptext

CREATE CURSOR sqlstuff (paramval c(50))
*-- recall parameters separated by commans, but may have CRs due to formatting
nsql = ALINES(sqlarr, STRTRAN(sqlcx, CHR(13), ''), 1+4, ',')
FOR ni = 1 TO nsql
	ctmp = ALLTRIM(STRTRAN(LEFT(sqlarr[ni], ATC(' ',sqlarr[ni])-1),CHR(9),''))
	INSERT INTO sqlstuff VALUES (ALLTRIM(STRTRAN(ctmp,CHR(13),'')))
endfor

*-- 
nphp = ALINES(aphp, STRTRAN(phpcx, CHR(13), ''), 1+4, ',')
CREATE CURSOR phpstuff (varvals c(50))

FOR ni = 1 TO nphp
	ctmp = ALLTRIM(STRTRAN(aphp[ni],CHR(9),''))
	INSERT INTO phpstuff VALUES (ALLTRIM(STRTRAN(ctmp,CHR(13),'')))
endfor


*-- looking at a sql insert statement - highlight/copy insert field list
cinsert = _cliptext
ninsert = ALINES(ainsert, STRTRAN(STRTRAN(cinsert,CHR(13),''),CHR(9),''),1+4,',')
CREATE CURSOR insertstuff (varvals c(50))
FOR ni = 1 TO ninsert
	ctmp = ALLTRIM(ainsert[ni])
	INSERT INTO insertstuff VALUES (ctmp)
endfor


RETURN
*----------------------------------------------

FUNCTION make_explicit_param_assoc_for_php_query_params
*-- highlight the variable assignments - the $v= - these will all be turned into - paramname := $x
*-- note: by doing things this way order is extremely important. so take care

cstr = _cliptext
nlines = ALINES(atmp, strtran(cstr, CHR(9), ''), 1+4)
cnew = '"'
nitems = 0
FOR ni = 1 TO nlines
	cline = LEFT(ALLTRIM(atmp[ni]), ATC('=', atmp[ni]) - 1)
	cnew = cnew + 'p_' + SUBSTR(cline,4) + ' := $' + ALLTRIM(STR(ni)) + ', '
	IF nitems > 3
		cnew = cnew + '" .' + CHR(13) + '"'
		nitems = 0
	ENDIF
	nitems = nitems + 1
ENDFOR
_cliptext = cnew


*-- for this second part, this will create the array items in the correct sequence - aka, must highlight/copy
*-- just like above, but this time the result will just be a long list of php var names separated by commas

cstr = _cliptext
nlines = ALINES(atmp, strtran(cstr, CHR(9), ''), 1+4)
cnew = 'array('
nitems = 0
FOR ni = 1 TO nlines
	cline = ALLTRIM(LEFT(ALLTRIM(atmp[ni]), ATC('=', atmp[ni]) - 1))
	IF nitems > 4
		cnew = cnew + ', ' + cline + ', ' + CHR(13)
		nitems = 0
	ELSE
		IF ni == 0 AND nitems == 0
			cnew = cnew + ', ' + cline
		ELSE	
			cnew = cnew + IIF(nitems == 0, '', ', ') + cline
		ENDIF
		nitems = nitems + 1
	ENDIF
ENDFOR
cnew = cnew + ')'
_cliptext = cnew


RETURN



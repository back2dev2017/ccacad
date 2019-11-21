
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


*!*	UPDATE course_attendee_list
*!*		SET accept_criticism = p_accept_criticism, accept_responsibility = p_accept_responsibility, adult_incarcerations = p_adult_incarcerations, 
*!*			age = p_age, att_id_use = p_att_id_use, citizen = p_citizen, 
*!*			club_leader = p_club_leader, club_leader_explain = p_club_leader_explain, club_leader_explain = p_club_leader_explain, 
*!*			clubs_in_prison = p_clubs_in_prison, clubs_prior = p_clubs_prior, course_id = p_course_id, 
*!*			current_alcohol = p_current_alcohol, current_drug = p_current_drug, currently_employed = p_currently_employed, 
*!*			develop_goals = p_develop_goals, doc_number = p_doc_number, drop_date = p_drop_date, 
*!*			email = p_email, employ = p_employ, employ_plan = p_employ_plan, 
*!*			employ_plan_explain = p_employ_plan_explain, enroll_date = p_enroll_date, express_needs = p_express_needs, 
*!*			fam_crime_history = p_fam_crime_history, fam_involve = p_fam_involve, fam_relationship = p_fam_relationship, 
*!*			family_crime_history = p_family_crime_history, first_arrest_age = p_first_arrest_age, fname = p_fname, 
*!*			formation_group_id = p_formation_group_id, friends_during_prison = p_friends_during_prison, friendships = p_friendships, 
*!*			gender = p_gender, highest_education = p_highest_education, 
*!*			lname = p_lname, make_friends = p_make_friends, manage_money = p_manage_money, 
*!*			manage_problems = p_manage_problems, marital_status = p_marital_status, military = p_military, 
*!*			num_addr_change = p_num_addr_change, num_child = p_num_child, num_discipline_infractions = p_num_discipline_infractions, 
*!*			num_friends_criminal = p_num_friends_criminal, num_positive_model = p_num_positive_model, parole_eligible = p_parole_eligible, 
*!*			previous_convictions = p_previous_convictions, provide_good_criticism = p_provide_good_criticism, race = p_race, 
*!*			release_date = p_release_date, school_expel = p_school_expel, skill_plan = p_skill_plan, 
*!*			skill_plan_explain = p_skill_plan_explain, understand_other_views = p_understand_other_views, use_alcohol = p_use_alcohol, 
*!*			use_contrib_crime = p_use_contrib_crime, use_drugs = p_use_drugs, workbook_status = p_workbook_status, 
*!*		WHERE id = p_id





*!*	(accept_criticism, accept_responsibility, adult_incarcerations, age, att_id_use, 
*!*	citizen, club_leader, club_leader_explain, club_leader_explain, clubs_in_prison, 
*!*	clubs_prior, course_id, current_alcohol, current_drug, currently_employed, 
*!*	develop_goals, doc_number, drop_date, email, employ, 
*!*	employ_plan, employ_plan_explain, enroll_date, express_needs, fam_crime_history, 
*!*	fam_involve, fam_relationship, family_crime_history, first_arrest_age, fname, 
*!*	formation_group_id, friends_during_prison, friendships, gender, highest_education, 
*!*	id, lname, make_friends, manage_money, manage_problems, 
*!*	marital_status, military, num_addr_change, num_child, num_discipline_infractions, 
*!*	num_friends_criminal, num_positive_model, parole_eligible, previous_convictions, provide_good_criticism, 
*!*	race, release_date, school_expel, skill_plan, skill_plan_explain, 
*!*	understand_other_views, use_alcohol, use_contrib_crime, use_drugs, workbook_status) 
*!*	VALUES 
*!*	(p_accept_criticism, p_accept_responsibility, p_adult_incarcerations, p_age, p_att_id_use, 
*!*	p_citizen, p_club_leader, p_club_leader_explain, p_club_leader_explain, p_clubs_in_prison, 
*!*	p_clubs_prior, p_course_id, p_current_alcohol, p_current_drug, p_currently_employed, 
*!*	p_develop_goals, p_doc_number, p_drop_date, p_email, p_employ, 
*!*	p_employ_plan, p_employ_plan_explain, p_enroll_date, p_express_needs, p_fam_crime_history, 
*!*	p_fam_involve, p_fam_relationship, p_family_crime_history, p_first_arrest_age, p_fname, 
*!*	p_formation_group_id, p_friends_during_prison, p_friendships, p_gender, p_highest_education, 
*!*	p_id, p_lname, p_make_friends, p_manage_money, p_manage_problems, 
*!*	p_marital_status, p_military, p_num_addr_change, p_num_child, p_num_discipline_infractions, 
*!*	p_num_friends_criminal, p_num_positive_model, p_parole_eligible, p_previous_convictions, p_provide_good_criticism, 
*!*	p_race, p_release_date, p_school_expel, p_skill_plan, p_skill_plan_explain, 
*!*	p_understand_other_views, p_use_alcohol, p_use_contrib_crime, p_use_drugs, p_workbook_status)




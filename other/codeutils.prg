
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


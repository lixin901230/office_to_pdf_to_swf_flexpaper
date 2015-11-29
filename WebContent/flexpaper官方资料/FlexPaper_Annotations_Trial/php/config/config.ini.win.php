; <?php exit; ?> DO NOT REMOVE THIS LINE
{
"allowcache":true,
"splitmode":false,
"path.pdf":"C:\\inetpub\\wwwroot\\flexpaper\\pdf",
"path.swf":"C:\\inetpub\\wwwroot\\flexpaper\\docs",
"renderingorder.primary":"flash",
"renderingorder.secondary":"html",
"cmd.conversion.singledoc":"pdf2swf.exe \"{path.pdf}{pdffile}\" -o \"{path.swf}{pdffile}.swf\" -f -T 9 -t -s storeallcharacters -s linknameurl",
"cmd.conversion.splitpages":"pdf2swf.exe \"{path.pdf}{pdffile}\" -o \"{path.swf}{pdffile}_%.swf\" -f -T 9 -t -s storeallcharacters -s linknameurl",
"cmd.conversion.renderpage":"swfrender.exe \"{path.swf}{swffile}\" -p {page} -o \"{path.swf}{pdffile}_{page}.png\" -X 2048 -s keepaspectratio",
"cmd.conversion.rendersplitpage":"swfrender.exe \"{path.swf}{swffile}\" -o \"{path.swf}{pdffile}_{page}.png\" -X 2048 -s keepaspectratio",
"cmd.conversion.jsonfile":"pdf2json.exe \"{path.pdf}{pdffile}\" -enc UTF-8 -compress \"{path.swf}{pdffile}.js\"",
"cmd.conversion.splitjsonfile":"pdf2json.exe \"{path.pdf}{pdffile}\" -enc UTF-8 -compress -split 10 \"{path.swf}{pdffile}_%.js\"",
"cmd.conversion.splitpdffile":"pdftk.exe \"{path.pdf}{pdffile}\" burst output \"{path.swf}{pdffile}_%1d.pdf\" compress",
"cmd.searching.extracttext":"swfstrings.exe \"{swffile}\"",
"cmd.query.swfwidth":"swfdump \"{swffile}\" -X",
"cmd.query.swfheight":"swfdump.exe \"{swffile}\" -Y"
}
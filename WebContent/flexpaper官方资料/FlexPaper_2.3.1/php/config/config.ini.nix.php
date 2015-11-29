; <?php exit; ?> DO NOT REMOVE THIS LINE
{
"allowcache":true,
"splitmode":false,
"path.pdf":"\/var\/www\/flexpaper\/pdf\/",
"path.swf":"\/var\/www\/flexpaper\/docs\/",
"renderingorder.primary":"flash",
"renderingorder.secondary":"html",
"cmd.conversion.singledoc":"pdf2swf \"{path.pdf}{pdffile}\" -o \"{path.swf}{pdffile}.swf\" -f -T 9 -t -s storeallcharacters -s linknameurl",
"cmd.conversion.splitpages":"pdf2swf \"{path.pdf}{pdffile}\" -o \"{path.swf}{pdffile}_%.swf\" -f -T 9 -t -s storeallcharacters -s linknameurl",
"cmd.conversion.renderpage":"swfrender \"{path.swf}{swffile}\" -p {page} -o \"{path.swf}{pdffile}_{page}.png\" -X 1024 -s keepaspectratio",
"cmd.conversion.rendersplitpage":"swfrender \"{path.swf}{swffile}\" -o \"{path.swf}{pdffile}_{page}.png\" -X 1024 -s keepaspectratio",
"cmd.conversion.jsonfile":"pdf2json \"{path.pdf}{pdffile}\" -enc UTF-8 -compress \"{path.swf}{pdffile}.js\"",
"cmd.conversion.splitjsonfile":"pdf2json \"{path.pdf}{pdffile}\" -enc UTF-8 -compress -split 10 \"{path.swf}{pdffile}_%.js\"",
"cmd.searching.extracttext":"swfstrings \"{swffile}\"","cmd.query.swfwidth":"swfdump {swffile} -X",
"cmd.query.swfheight":"swfdump \"{swffile}\" -Y"
}

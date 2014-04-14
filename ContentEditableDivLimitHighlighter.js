function ContentEditableDivCharLimitHighlighter(contentEditableDivNode,limit,color){
	if(typeof limit == "undefined")
		limit=160;
	if(typeof color == "undefined")
		color="#fcc";
	contentEditableDivNode.addEventListener("keyup",keyIsUp,false);
	function keyIsUp(e){
		carretPos=getCaretCharacterOffsetWithin(e.target);
		highlight(e.target,limit,color);
		if(carretPos!=getInnerText(e.target).length)
			setSelectionRange(e.target,carretPos,carretPos);
		else
			setEndOfContenteditable(e.target);
	}
	function highlight(element,position,color)
	{
		/*var innerHTML = element.innerHTML;
		innerHTML=innerHTML.replace(/<[^>]*>/g, "");*/
		var innerHTML=getInnerText(element);
		innerHTML =innerHTML.substring(0,position)+ "<span style='background:" + color + "'>" +innerHTML.substring(position) + "</span>";
		element.innerHTML = innerHTML ;
	}

	function getCaretCharacterOffsetWithin(element) {
		var caretOffset = 0;
		if (typeof window.getSelection != "undefined") {
			var range = window.getSelection().getRangeAt(0);
			var preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			caretOffset = preCaretRange.toString().length;
		} else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
			var textRange = document.selection.createRange();
			var preCaretTextRange = document.body.createTextRange();
			preCaretTextRange.moveToElementText(element);
			preCaretTextRange.setEndPoint("EndToEnd", textRange);
			caretOffset = preCaretTextRange.text.length;
		}
		return caretOffset;
	}
	function getTextNodesIn(node) {
		var textNodes = [];
		if (node.nodeType == 3) {
			textNodes.push(node);
		} else {
			var children = node.childNodes;
			for (var i = 0, len = children.length; i < len; ++i) {
				textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
			}
		}
		return textNodes;
	}

	function setSelectionRange(el, start, end) {
		if (document.createRange && window.getSelection) {
			var range = document.createRange();
			range.selectNodeContents(el);
			var textNodes = getTextNodesIn(el);
			var foundStart = false;
			var charCount = 0, endCharCount;

			for (var i = 0, textNode; textNode = textNodes[i++]; ) {
				endCharCount = charCount + textNode.length;
				if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i < textNodes.length))) {
					range.setStart(textNode, start - charCount);
					foundStart = true;
				}
				if (foundStart && end <= endCharCount) {
					range.setEnd(textNode, end - charCount);
					break;
				}
				charCount = endCharCount;
			}

			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		} else if (document.selection && document.body.createTextRange) {
			var textRange = document.body.createTextRange();
			textRange.moveToElementText(el);
			textRange.collapse(true);
			textRange.moveEnd("character", end);
			textRange.moveStart("character", start);
			textRange.select();
		}
	}

	function setEndOfContenteditable(contentEditableElement)
	{
		var range,selection;
		if(document.createRange)
		{
			range = document.createRange();
			range.selectNodeContents(contentEditableElement);
			range.collapse(false);
			selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange(range);
		}
		else if(document.selection)
		{ 
			range = document.body.createTextRange();
			range.moveToElementText(contentEditableElement);
			range.collapse(false);
			range.select();
		}
	}
	function getInnerText(el) {
		return el.textContent || el.innerText;
	}
}
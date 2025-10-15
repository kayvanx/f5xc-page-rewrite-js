/**
	* v1.2 - Oct 2025 - By: Kayvan Farzaneh (kayvan@f5.com)
	*	
	* A reusable script that finds and replaces text on a page.
	* Configuration is passed via URL parameters in the <script> src attribute.
	*
	* @param {string} search - The text or regex pattern to find.
	* - For a regex, format it like: /pattern/flags (e.g., /domestic cat/gi)
	*	 	> 'g' flag = global (replace all instances, not just the first).
	*	 	> 'i' flag = case-insensitive (match 'Cat', 'CAT', etc.).
	* - The value must be URL-encoded.
	* @param {string} replacewith - The text to use as a replacement.
	* - The value must be URL-encoded.
	*
	* Example Usage:
	*	 	 	 ?search=%2Fdomestic%20cat%2Fgi&replacewith=happy%20dog
	*/
(() => {
    // Default Configuration
    // These values are used if 'search' or 'replacewith' are not
    // provided as URL parameters in the <script> tag.
    const DEFAULT_SEARCH_TERM = /domestic cat/gi;
    const DEFAULT_REPLACEMENT_TEXT = 'happy dog';

	 	 const currentScript = document.currentScript;

	 	 if (!currentScript) {
	 	 	 	 return;
	 	 }
	 	 const scriptUrl = new URL(currentScript.src);
	 	 const urlSearchTerm = scriptUrl.searchParams.get('search');
	 	 const urlReplacementText = scriptUrl.searchParams.get('replacewith');
	 	 let searchPattern;
	 	 let replacementText;
	 	 let logSearchTerm;
	 	 if (urlSearchTerm && urlReplacementText !== null) {
	 	 	 	 logSearchTerm = urlSearchTerm;
	 	 	 	 replacementText = urlReplacementText;
	 	 	 	 const regexParser = /^\/(.*)\/([gimyus]*)$/;
	 	 	 	 const match = urlSearchTerm.match(regexParser);

	 	 	 	 if (match) {
	 	 	 	 	 	 try {
	 	 	 	 	 	 	 	 searchPattern = new RegExp(match[1], match[2]);
	 	 	 	 	 	 } catch (e) {
	 	 	 	 	 	 	 	 return;
	 	 	 	 	 	 }
	 	 	 	 } else {
	 	 	 	 	 	 const escapedTerm = urlSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	 	 	 	 	 	 searchPattern = new RegExp(escapedTerm, 'g');
	 	 	 	 }
	 	 } else {
	 	 	 	 searchPattern = DEFAULT_SEARCH_TERM;
	 	 	 	 replacementText = DEFAULT_REPLACEMENT_TEXT;
	 	 	 	 logSearchTerm = String(DEFAULT_SEARCH_TERM);
	 	 }

	 	 if (!searchPattern || replacementText === null) {
	 	 	 	 return;
	 	 }

	 	 function findAndReplace(rootNode, pattern, replacement) {
	 	 	 	 const treeWalker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT);
	 	 	 	 const nodesToProcess = [];
	 	 	 	 let currentNode;
	 	 	 	 while (currentNode = treeWalker.nextNode()) {
	 	 	 	 	 	 nodesToProcess.push(currentNode);
	 	 	 	 }

	 	 	 	 nodesToProcess.forEach(node => {
	 	 	 	 	 	 const parentTag = node.parentElement ? node.parentElement.tagName.toUpperCase() : '';
	 	 	 	 	 	 if (parentTag !== 'SCRIPT' && parentTag !== 'STYLE') {
	 	 	 	 	 	 	 	 const originalText = node.nodeValue;
	 	 	 	 	 	 	 	 const newText = originalText.replace(pattern, replacement);
	 	 	 	 	 	 	 	 if (newText !== originalText) {
	 	 	 	 	 	 	 	 	 	 node.nodeValue = newText;
	 	 	 	 	 	 	 	 }
	 	 	 	 	 	 }
	 	 	 	 });
	 	 }

	 	 findAndReplace(document.body, searchPattern, replacementText);
})();


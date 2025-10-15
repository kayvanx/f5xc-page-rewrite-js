/**
	* v1.3 - Oct 2025 - By: Kayvan Farzaneh (kayvan@f5.com)
	*	
	* A reusable script that finds and replaces text within the href attribute of <a> tags.
	* Configuration is passed via URL parameters in the <script> src attribute.
	*
	* @param {string} search - The text or regex pattern to find in the link's href.
	* - Must be URL-encoded.
	* @param {string} replacewith - The text to use as a replacement.
	* - Must be URL-encoded.
	*
	* Example Parameter (upgrading in-page links from HTTP:// to HTTPS://):
	*	 ?search=http%3A%2F%2F&replacewith=https%3A%2F%2F
	*
	* Example (changing a domain):
	*	 ?search=old-domain.com&replacewith=new-domain.com
	*/
(() => {
    // Default Configuration
    // These values are used if 'search' or 'replacewith' are not
    // provided as URL parameters in the <script> tag.
    const DEFAULT_SEARCH_TERM = 'http://';
    const DEFAULT_REPLACEMENT_TEXT = 'https://';

	 	 const currentScript = document.currentScript;

	 	 if (!currentScript) {
	 	 	 	 return;
	 	 }

	 	 const scriptUrl = new URL(currentScript.src);
	 	 const urlSearchTerm = scriptUrl.searchParams.get('search');
	 	 const urlReplacementText = scriptUrl.searchParams.get('replacewith');

	 	 let searchTerm;
	 	 let replacementText;
	 	 let searchPattern;

	 	 if (urlSearchTerm && urlReplacementText !== null) {
	 	 	 	 searchTerm = urlSearchTerm;
	 	 	 	 replacementText = urlReplacementText;
	 	 } else {
	 	 	 	 searchTerm = DEFAULT_SEARCH_TERM;
	 	 	 	 replacementText = DEFAULT_REPLACEMENT_TEXT;
	 	 }
	 	 const regexParser = /^\/(.*)\/([gimyus]*)$/;
	 	 const match = searchTerm.match(regexParser);

	 	 if (match) {
	 	 	 	 try {
	 	 	 	 	 	 searchPattern = new RegExp(match[1], match[2]);
	 	 	 	 } catch (e) {
	 	 	 	 	 	 return;
	 	 	 	 }
	 	 } else {
	 	 	 	 const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	 	 	 	 searchPattern = new RegExp(escapedTerm, 'g');
	 	 }

	 	 function findAndReplaceInLinks(pattern, replacement) {
	 	 	 	 const allLinks = document.querySelectorAll('a[href]');	

	 	 	 	 allLinks.forEach(link => {
	 	 	 	 	 	 const originalHref = link.getAttribute('href');

	 	 	 	 	 	 	if (originalHref && pattern.test(originalHref)) {
	 	 	 	 	 	 	 	 const newHref = originalHref.replace(pattern, replacement);
	 	 	 	 	 	 	 	 link.setAttribute('href', newHref);
	 	 	 	 	 	 }
	 	 	 	 });
	 	 }
	 	 findAndReplaceInLinks(searchPattern, replacementText);

})();


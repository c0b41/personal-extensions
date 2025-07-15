let code = `
	let mentionObserver = undefined
	let currentUrl = null

	window.onload = function () {
		setInterval(() => {
			setTimeout(() => {
				
				if(currentUrl != window.location.href) {

					if (mentionObserver !== undefined) {
						mentionObserver.disconnect()
					} else {
						mentionObserver = new MutationObserver(() => {
							let $menttionButton = document.querySelector('div[class*="mentionButton"]');
							if ($menttionButton !== null) {
								console.log("[Mention] button found, and mention ping disabled");
								$menttionButton.click();
							}
						});
					}
			
					if (mentionObserver != undefined && document.querySelector('div[class|="channelTextArea"]') != null ) {
						console.log("[Mention] observer started");
						mentionObserver.observe(document.querySelector('div[class|="channelTextArea"]'), { childList: true });
					}

					currentUrl = window.location.href;

				}

			}, 1000);

		}, 100)
		
	}
`
var script = document.createElement('script')
script.textContent = code
document.body.appendChild(script)
;(document.head || document.documentElement).appendChild(script)
script.remove()

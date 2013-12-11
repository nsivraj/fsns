var featureURL = localStorage.getItem("addfeature.added_feature");
if(featureURL == null)
{
	featureURL = prompt("URL of feature");
	if(featureURL != null)
	{
		localStorage.setItem("addfeature.added_feature", featureURL);
	}
}

if(featureURL != null)
{
	var scriptTag = '<script type="text/javascript" src="'+featureURL+'"></script>';
	setTimeout(function() {
		document.querySelector('body').insertAdjacentHTML('beforeend',scriptTag);
	}, 1000);
}

// document.querySelector('body').insertAdjacentHTML('beforeend','<script type="text/javascript" src="http://192.168.1.134/fsnextsteps.js"></script>');
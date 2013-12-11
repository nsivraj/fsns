
function clickNextstepsDropdown() {
	//alert('hi joe');

	var nextstepsListDiv = document.getElementById('NextstepsList');
	if(nextstepsListDiv == null)
	{
		nextstepListHtml = '<div class="action gadget gotoGadget personAdded" id="NextstepsGadget">'+
			'<div class="gotoList visible" style="top: 8px; left: -1080px; right: auto; bottom: auto;" id="NextstepsList">'+
			'<div class="scrolling-list scroll" style="height: 500px;" id="NextstepsScroll">'+
			'<a id="nextstepsEntry1" class="gotoEntry fs-icon-male-micro" href="https://familysearch.org/tree/#view=tree&amp;person=KPH8-HVV">'+
			'<span class="name male " title="平田金三郎">平田金三郎</span>'+
			'<p id="nextsteps_KPH8-HVV_lifespan" class="lifeSpan">1832-Deceased</p>'+
			'<p id="nextsteps_KPH8-HVV_pid" class="pid">KPH8-HVV</p></a>'+
			'<a id="nextstepsEntry2" class="gotoEntry fs-icon-male-micro" href="https://familysearch.org/tree/#view=tree&amp;person=KWHF-W95">'+
			'<span class="name male " title="Warren Lake Jarvis">Warren Lake Jarvis</span>'+
			'<p id="nextsteps_KWHF-W95_lifespan" class="lifeSpan">1921-2010</p>'+
			'<p id="nextsteps_KWHF-W95_pid" class="pid">KWHF-W95</p></a>'+
			'<a id="nextstepsEntry3" class="gotoEntry fs-icon-male-micro" href="https://familysearch.org/tree/#view=tree&amp;person=LHJ3-B47">'+
			'<span class="name male " title="Enos Hensley">Enos Hensley</span>'+
			'<p id="nextsteps_LHJ3-B47_lifespan" class="lifeSpan">1815-1880</p>'+
			'<p id="nextsteps_LHJ3-B47_pid" class="pid">LHJ3-B47</p></a>'+
			'<a id="nextstepsEntry4" class="gotoEntry fs-icon-male-micro" href="https://familysearch.org/tree/#view=tree&amp;person=98G9-96X"><span class="name male " title="Franklin Montague">Franklin Montague</span><p id="nextsteps_98G9-96X_lifespan" class="lifeSpan">1880-Deceased</p><p id="nextsteps_98G9-96X_pid" class="pid">98G9-96X</p></a><a id="nextstepsEntry5" class="gotoEntry fs-icon-female-micro" href="https://familysearch.org/tree/#view=tree&amp;person=KWZ8-DLY"><span class="name female living" title="Elizabeth Rhoades">Elizabeth Rhoades</span><p id="nextsteps_KWZ8-DLY_lifespan" class="lifeSpan">1967-Living</p><p id="nextsteps_KWZ8-DLY_pid" class="pid">KWZ8-DLY</p></a><a id="nextstepsEntry6" class="gotoEntry fs-icon-female-micro" href="https://familysearch.org/tree/#view=tree&amp;person=LZFT-BP5"><span class="name female " title="Jennie Bishop Arnold">Jennie Bishop Arnold</span><p id="nextsteps_LZFT-BP5_lifespan" class="lifeSpan">1858-Deceased</p><p id="nextsteps_LZFT-BP5_pid" class="pid">LZFT-BP5</p></a><a id="nextstepsEntry7" class="gotoEntry fs-icon-male-micro" href="https://familysearch.org/tree/#view=tree&amp;person=KWN3-H62"><span class="name male living" title="Joshua Seth Jarvis">Joshua Seth Jarvis</span><p id="nextsteps_KWN3-H62_lifespan" class="lifeSpan">1995-Living</p><p id="nextsteps_KWN3-H62_pid" class="pid">KWN3-H62</p></a><a id="nextstepsEntry8" class="gotoEntry fs-icon-unknown-micro" href="https://familysearch.org/tree/#view=tree&amp;person=LDB2-JFW"><span class="name unknown living" title="Unknown Name">Unknown Name</span><p id="nextsteps_LDB2-JFW_lifespan" class="lifeSpan">Living</p><p id="nextsteps_LDB2-JFW_pid" class="pid">LDB2-JFW</p></a><a id="nextstepsEntry9" class="gotoEntry fs-icon-male-micro" href="https://familysearch.org/tree/#view=tree&amp;person=9FPF-7M2"><span class="name male " title="Burton Hensley">Burton Hensley</span><p id="nextsteps_9FPF-7M2_lifespan" class="lifeSpan">1868-Deceased</p><p id="nextsteps_9FPF-7M2_pid" class="pid">9FPF-7M2</p></a><a id="nextstepsEntry10" class="gotoEntry fs-icon-male-micro" href="https://familysearch.org/tree/#view=tree&amp;person=K24F-872"><span class="name male " title="Marcus Augustus Lindley">Marcus Augustus Lindley</span><p id="nextsteps_K24F-872_lifespan" class="lifeSpan">1845-1926</p><p id="nextsteps_K24F-872_pid" class="pid">K24F-872</p></a>'+
			'<a id="nextstepsEntry11" class="gotoEntry fs-icon-male-micro" href="https://familysearch.org/tree/#view=tree&amp;person=KWFG-4KK">'+
			'<span class="name male living" title="Matthew Ammon Jarvis">Matthew Ammon Jarvis</span>'+
			'<p id="nextsteps_KWFG-4KK_lifespan" class="lifeSpan">1994-Living</p>'+
			'<p id="nextsteps_KWFG-4KK_pid" class="pid">KWFG-4KK</p></a>'+
			'</div></div></div>';
		
		var gotoDiv = document.getElementById('Goto');
		gotoDiv.insertAdjacentHTML('beforebegin', nextstepListHtml);
	}
	else if($(nextstepsListDiv).is(':visible'))
	{
		//make nextstepsListDiv invisible
		$(nextstepsListDiv).hide();
	}
	else
	{
		var nextstepsScrollDiv = document.getElementById('NextstepsScroll');
		nextstepsScrollDiv.style.height = "500px";
		//make nextstepsListDiv visible
		$(nextstepsListDiv).show();
	}
	
}

function addFeature() {
	// if the current page url is familysearch.org/tree* then proceed else stop
	
	// look for the nextsteps cache and use it to build the nextsteps dropdown
	// if the nextsteps cache does NOT exist then build it
	// if the nextsteps cache DOES exist then make sure it is uptodate
	
	// insert the dropdown into the page
	var nextstepDropdownHtml = '<span class="pageTabItem hasSub selected" id="nextstepTab">'+
            '<a class="pageTabLink fs-icon-favorites" data-event="tabClicked" href="javascript:void(0);">Nextsteps</a>'+
            '<a class="pageSubLink" data-list="tree" href="javascript:clickNextstepsDropdown();"></a>'+
          	'</span>';
	var treeTab = document.getElementById('treeTab');
	treeTab.insertAdjacentHTML('beforebegin', nextstepDropdownHtml);
}

setTimeout(function() {
	addFeature();
}, 3000);


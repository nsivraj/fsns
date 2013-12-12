//Storage.prototype.setObject = function(key, value) {
//    this.setItem(key, JSON.stringify(value));
//}

//Storage.prototype.getObject = function(key) {
//    var value = this.getItem(key);
//    return value && JSON.parse(value);
//}

function createNextstepList(nextstepListStr) {
	var nextstepList = JSON.parse(nextstepListStr);
	return new NextstepList(nextstepList);
}


function NextstepList (nsData) {
	if(nsData != null) {
		//alert("nsData.nsList: "+nsData.nsList);
		this.nsList = nsData.nsList;
		this.nsMap = nsData.nsMap;
		this.personList = nsData.personList;
		this.personMap = nsData.personMap;
		//alert("nsData.currentPersonIdIndex: "+nsData.currentPersonIdIndex);
		this.currentPersonIdIndex = nsData.currentPersonIdIndex;
	} else {
	    this.nsList = [];
	    this.nsMap = {};
	    this.personList = [];
	    this.personMap = {};
	    this.currentPersonIdIndex = -1;
    }
}

NextstepList.prototype = {
    addPerson: function(person) {
    	if(!this.containsPersonId(person.id)) {
			//alert("adding person.id: "+person.id);
          	person.personIndex = this.personList.length;
	      	this.personMap[person.id] = person;
	      	this.personList.push(person.id);
    	}
    },
    getPersonIdIndex: function(personId) {
    	return this.personMap[personId].personIndex;
    },
    containsPersonId: function(personId) {
    	return this.personMap[personId] != undefined;
    },
    getCurrentPersonIdIndex: function() {
    	return this.currentPersonIdIndex;
    },
    setCurrentPersonIdIndex: function(index) {
    	this.currentPersonIdIndex = index;
    },
    incrementCurrentPersonIdIndex: function() {
    	this.currentPersonIdIndex += 1;
    },
    hasMorePersons: function() {
    	return this.currentPersonIdIndex < (this.personList.length - 1);
    },
    getCurrentPersonId: function() {
    	return this.personList[this.currentPersonIdIndex];
    },
    getPersonAtCurrentIndex: function () {
    	return this.personMap[this.getCurrentPersonId()];
    },
    addNextstep: function(person, ordinances) {
    	if(ordinances != null && !this.containsNextstep(person.id)) {
			//alert("adding nextstep: "+person.id);
	    	person.ordinances = ordinances;
	    	person.nsIndex = this.nsList.length;
	    	this.nsMap[person.id] = person;
	    	this.nsList.push(person.id);
	    	delete this.personMap[person.id];
	    	return true;
    	}
    	return false;
    },
    getNextsteps: function() {
    	return this.nsList;
    },
    getNextstep: function(personId) {
    	return this.nsMap[personId];
    },
    size: function() {
    	return this.nsList.length;
    },
    containsNextstep: function(personId) {
    	return this.nsMap[personId] != undefined;
    }
};





function createPerson(personId, name, lifeSpan, gender, living) {
	var person = new Object();
	person.id = personId;
	person.name = name;
	person.lifeSpan = lifeSpan;
	person.gender = gender.toLowerCase();
	person.living = living;
	return person;
}

function addPerson(nextstepsList, personData) {
	if(personData && personData.id && !nextstepsList.containsPersonId(personData.id)) {
		nextstepsList.addPerson(createPerson(personData.id, personData.name, personData.lifeSpan, personData.gender, personData.living));
	}
}

// this method only looks for nextsteps and puts them
// in the localStorage, IT DOES NOT AND MUST NOT ATTEMPT
// TO INSERT THE DATA INTO THE ACTUAL HTML ELEMENT IN THE PAGE
function findNextsteps(nextstepsListParam) {
	
	var nextstepsList = nextstepsListParam;
	if(nextstepsList == null) {
		nextstepsList = localStorage.getItem("familysearch.org.nextstepsList");
		if(nextstepsList == null) {
			nextstepsList = new NextstepList();
			addPerson(nextstepsList, createPerson(loggedInPersonId, "", "", "????-Living", true));
			nextstepsList.setCurrentPersonIdIndex(0);
			localStorage.setItem("familysearch.org.nextstepsList", JSON.stringify(nextstepsList));
		} else {
			nextstepsList = createNextstepList(nextstepsList);
		}
	}
	
	// get the nextuser to process from the nextstepsList and set it in currentPerson
	var currentPerson = nextstepsList.getPersonAtCurrentIndex();
	if(keepFinding(currentPerson, nextstepsList)) {
		//alert("currentPerson.id :: "+currentPerson.id+" :: currentPerson.name :: "+currentPerson.name);
		$.ajax({
		    url: '/tree-data/family-members/person/'+currentPerson.id+'?tz=420&locale='+FS.locale,
		    dataType: 'JSON',
		    success: function(familyData, status) {
		        if(familyData.status == "OK")
		        {
		            //1) need to store a path of how I got to this user
		            //2) need to determine the order in which to add the
		            //   members of this family to the end of the traversList (parents.husband, parents.wife,
		            //   spouses.husband, spouses.wife, parents.children, spouses.children)
		            //   but only add them if they are not already in the traversList, the traversList
		            //   needs to maintain order as well as be keyed by person id, we also need to know
		            //   the current index of where we are processing in the traversList.
		            
		            //two lists, each uniquely keyed off of person id,
		            //one list of person ids to travers to find additional persons (traversList), and
		            //the other list of persons to show in the nextsteps tab dropdown (nextstepsList)
		            
		        	if(familyData.data.parents != null) {
		        		// loop over parents
				        $.each(familyData.data.parents, function(key, value) {
				        	//alert("value.children: "+value.children);
				        	//alert("value.husband: "+value.husband);
				        	//alert("value.wife: "+value.wife);
				        	addPerson(nextstepsList, value.husband);
				        	addPerson(nextstepsList, value.wife);
				        	if(value.children != null) {
					        	$.each(value.children, function(childKey, child) {
					        		addPerson(nextstepsList, child);
					        	});
				        	}
				        });
			        }
			        
			        if(familyData.data.spouses != null) {
				        // loop over spouses
				        $.each(familyData.data.spouses, function(key, value) {
				        	//alert("value.children: "+value.children);
				        	//alert("value.husband: "+value.husband);
				        	//alert("value.wife: "+value.wife);
				        	addPerson(nextstepsList, value.husband);
				        	addPerson(nextstepsList, value.wife);
				        	if(value.children != null) {
					        	$.each(value.children, function(childKey, child) {
					        		addPerson(nextstepsList, child);
					        	});
				        	}
				        });
					}
					
					// save off the new set of persons that we just found
					localStorage.setItem("familysearch.org.nextstepsList", JSON.stringify(nextstepsList));
					
					//add the currentPerson to the nextsteps list if they are not
					//living and have ordinances that are not yet completed
					if(currentPerson.living === false)
					{
						$.ajax({
							url: '/tree-data/reservations/person/'+currentPerson.id+'/ordinances?tz=420&locale='+FS.locale,
							dataType: 'JSON',
							success: function(ordData, ordStatus) {
								if(ordData.status == "OK") {
									var ordinances = getIncompleteOrdinances(ordData.data);
									if(ordinances != null && nextstepsList.addNextstep(currentPerson, ordinances)) {
										localStorage.setItem("familysearch.org.nextstepsList", JSON.stringify(nextstepsList));
									}
								}
								determineIfDone(currentPerson, nextstepsList);
							},
							error: function(ordXhr, ordStatus, ordError) {
								//show the error
								//alert("error: "+ordXhr.responseText);
								determineIfDone(currentPerson, nextstepsList);
							}
						});
					}
					else
					{
						determineIfDone(currentPerson, nextstepsList);
					}
		        }
		    },
		    error: function(xhr, status, error) {
		        //show the error
		        //alert("error: "+xhr.responseText);
		    }
		});
	}
}


function getIncompleteOrdinances(ordData) {
	var incompleteOrdinances = "";
	var notneededStatus = "NotNeeded";
	if(ordData.baptism.status == notneededStatus &&
	   ordData.confirmation.status == notneededStatus &&
	   ordData.initiatory.status == notneededStatus &&
	   ordData.endowment.status == notneededStatus) {
	   incompleteOrdinances = undefined;
	} else {
		var completedStatus = "Completed";
		if(ordData.baptism.status != completedStatus) { incompleteOrdinances += "b,"; }
		if(ordData.confirmation.status != completedStatus) { incompleteOrdinances += "c,"; }
		if(ordData.initiatory.status != completedStatus) { incompleteOrdinances += "i,"; }
		if(ordData.endowment.status != completedStatus) { incompleteOrdinances += "e,"; }
		if(!checkAllEqualStatus(ordData.sealingsToParents, completedStatus)) { incompleteOrdinances += "sp,"; }
		if(!checkAllEqualStatus(ordData.sealingsToSpouses, completedStatus)) { incompleteOrdinances += "ss"; }
		
		if(incompleteOrdinances.charAt(incompleteOrdinances.length - 1) == ',') {
			incompleteOrdinances = incompleteOrdinances.substr(0, incompleteOrdinances.length - 1);
		}
		if(incompleteOrdinances.length == 0) { incompleteOrdinances = undefined; }
	}
	
	return incompleteOrdinances;
}


function checkAllEqualStatus(objArray, statusToCheck) {
	for (var i = 0; i < objArray.length; i++) {
		if(objArray[i].status != statusToCheck) {
			return false;
		}
	}
	return true;
}

function keepFinding(currentPerson, nextstepsList) {
	//var keepFinding = prompt('Continue finding ancestors? ['+currentPerson.id+' :: '+nextstepsList.size()+']', 'yes');
	//if(nextstepsList.size() < 10 && nextstepsList.hasMorePersons() && keepFinding == 'yes')
	if(nextstepsList.size() < 20 && nextstepsList.hasMorePersons())
	{
		return true;
	}
	
	return false;
}

function determineIfDone(currentPerson, nextstepsList) {
	// add logic to see if we are done and if not then
	// invoke the findNextsteps() method again
	nextstepsList.incrementCurrentPersonIdIndex();
	localStorage.setItem("familysearch.org.nextstepsList", JSON.stringify(nextstepsList));
	findNextsteps(nextstepsList);
}


function populateNextsteps() {
	var nextstepsList = localStorage.getItem("familysearch.org.nextstepsList");
	if(nextstepsList != null) {
		nextstepsList = createNextstepList(nextstepsList);
		var nextstepsScrollDiv = document.getElementById('NextstepsScroll');
		
		// loop over the nextstepsList and add an entry for each
		// one of the items in the list to nextstepsScrollDiv
		var nsList = nextstepsList.getNextsteps();
		for (var i = 0; i < nsList.length; i++) {
			var pNS = nextstepsList.getNextstep(nsList[i]);
			var pNSElem = document.getElementById('nextsteps_'+pNS.id+'_lifespan');
			if(pNSElem == null) {
				var nsEntry = '<a id="nextstepsEntry"'+i+' class="gotoEntry fs-icon-'+pNS.gender+'-micro" href="https://familysearch.org/tree/#view=tree&amp;person='+pNS.id+'">'+
							  '<span class="name '+pNS.gender+' " title="'+pNS.name+'">'+pNS.name+'</span>'+
							  '<p id="nextsteps_'+pNS.id+'_lifespan" class="lifeSpan">'+pNS.lifeSpan+'</p>'+
							  '<p id="nextsteps_'+pNS.id+'_pid" class="pid">'+pNS.id+'</p></a>';
				
				nextstepsScrollDiv.insertAdjacentHTML('beforeend', nsEntry);
			}
		}
		
		localStorage.setItem("familysearch.org.nextstepsList", JSON.stringify(nextstepsList));
	}
}

function clickNextstepsDropdown() {
	//alert('hi joe');

	var nextstepsListDiv = document.getElementById('NextstepsList');
	if(nextstepsListDiv == null)
	{
		var nextstepListHtml = '<div class="action gadget gotoGadget personAdded" id="NextstepsGadget">'+
			'<div class="gotoList visible" style="top: 8px; left: -1080px; right: auto; bottom: auto;" id="NextstepsList">'+
			'<div class="scrolling-list scroll" style="height: 500px;" id="NextstepsScroll">'+
			'</div></div></div>';
		var gotoDiv = document.getElementById('Goto');
		gotoDiv.insertAdjacentHTML('beforebegin', nextstepListHtml);
		setTimeout(populateNextsteps, 100);
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
		populateNextsteps();
		//make nextstepsListDiv visible
		$(nextstepsListDiv).show();
	}
	
}

function addFeature() {
	// if the current page url is familysearch.org/tree* then proceed else stop
	//alert(window.location.host);
	//alert(window.location.href);
	if(window.location.href.indexOf('familysearch.org/tree') != -1)
	{
		// look for the nextsteps cache and use it to build the nextsteps dropdown
		// if the nextsteps cache does NOT exist then build it
		// if the nextsteps cache DOES exist then make sure it is uptodate
		var treeTab = document.getElementById('treeTab');
		if(treeTab == null)
		{
			// the addFeature() method continues to be called until
			// the document element with id 'treeTab' is available in the document 
			setTimeout(function() {
				addFeature();
			}, 500);
		}
		else
		{
	    	//alert("adding nextsteps dropdown: "+treeTab);
			// insert the dropdown into the page
			//openssl base64 < /Users/normanjarvis/Downloads/shoe.svg | tr -d '\n' | pbcopy
			var nextstepDropdownHtml = '<span class="pageTabItem hasSub selected" id="nextstepTab">'+
		            '<a class="pageTabLink fs-icon-shoe" data-event="tabClicked" href="javascript:void(0);">Nextsteps</a>'+
		            '<a class="pageSubLink" data-list="tree" href="javascript:clickNextstepsDropdown();"></a>'+
		          	'</span>';
			treeTab.insertAdjacentHTML('beforebegin', nextstepDropdownHtml);
		}
	}
}


setTimeout(function() {
	addFeature();
	findNextsteps();
}, 500);




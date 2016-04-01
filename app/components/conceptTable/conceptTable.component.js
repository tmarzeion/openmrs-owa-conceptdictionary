(function(){
	'use strict';
	
	angular
		.module('conceptDictionaryApp')
		.component('conceptTable', {
			  templateUrl: 'components/conceptTable/conceptTable.html',
			  controller: conceptTable,
			  controllerAs : 'vm',
			  bindings: {
			    onUpdate: '&' 
			  }});
	
	conceptTable.$inject = []
	
		
	function conceptTable(){
		var vm = this;
		
		vm.members = [];
		vm.cachedMember = {display : ""};
		vm.isCachedMemberCorrect = false;
		vm.selectedMember;
		vm.onSearchBoxUpdate = onSearchBoxUpdate;
		vm.isMemberAddView = false;
		vm.isAlreadyMember = false;
		vm.pushMembers = pushMembers;
		vm.deleteMember = deleteMember;
		vm.resetSearchBox = resetSearchBox;
		vm.swapMembers = swapMembers;
		
		function pushMembers(){
			vm.members.push(vm.cachedMember);
			vm.resetSearchBox();
			update();
		}
		function deleteMember(){
			var index = vm.members.indexOf(vm.selectedMember);
			vm.members.splice(index, 1);
			update();
		}
		function onSearchBoxUpdate(isCorrect, concept){
			if(isCorrect){
				if(checkIfContainUuid(vm.members, concept.uuid)){
					vm.isCachedMemberCorrect = false;
					vm.isAlreadyMember = true;
				}
				else{
					vm.isCachedMemberCorrect = true;
					vm.isAlreadyMember = false;
				}
			}
			else vm.isCachedMemberCorrect = false;
			vm.cachedMember = concept;
		}
		function resetSearchBox(){
			vm.cachedMember = {display : ""};
			vm.isMemberAddView = false;
			vm.isCachedMemberCorrect = false;
			vm.isAlreadyMember = false;
		}
		function checkIfContainUuid(array, uuid){
			if (array.length==0) return false;
			for(var i=0;i<array.length;i++){
				if (array[i].uuid===uuid)return true
			}
			return false
		}
		function swapMembers(direction){
			var indexA = vm.members.indexOf(vm.selectedMember);
			var indexB;
			if(direction == "up") indexB = indexA-1;
			else indexB = indexA+1;
			swapInArray(vm.members, indexA, indexB)
		}
		function swapInArray(array, a, b){
			if(a<0 || b<0 || a>=array.length || b>=array.length) return false;
			var temp = array[a];
			array[a]= array[b];
			array[b] = temp;
		}
		function update(){
			vm.onUpdate({ concepts : vm.members });
		}
	}		
})();
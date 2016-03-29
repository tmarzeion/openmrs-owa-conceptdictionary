'use strict';

/* jasmine specs for controllers go here */
describe('Concept dictionary controllers', function() {

    beforeEach(function(){
        jasmine.addMatchers({
            toEqualData: function(util, customEqualityTesters) {
                return {
                    compare: function(actual, expected) {
                        var passed = angular.equals(actual, expected);
                        return {
                            pass: passed,
                            message: 'Expected ' + actual + (passed ? '' : ' not') + ' to equal ' + expected
                        }
                    }
                }
            }
        });
    });

    beforeEach(module('conceptDictionaryApp'));

    describe('openmrsRest', function(){
        var $httpBackend, openmrsRest, item, list, POSTitem, UPDATEitem, DELETEitem;

        beforeEach(inject(function(_$httpBackend_, _openmrsRest_){
        	openmrsRest = _openmrsRest_;
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('partials/index-menu.html').respond();
            $httpBackend.whenGET('/ws/rest/v1/item?v=full').
            respond({results:[{ name: 'item1',  
            					uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"},
            				  { name: 'item2', 
            					uuid: "3g65dc27-72ec-4ab5-9fa8-d98be91adb5b"},
            					{ name: 'item3', 
                				uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"}
            				]});            
            $httpBackend.whenGET('/ws/rest/v1/item/6g65dc56-72ec-4ab5-9fa8-d98be91adb5b').
            respond({ name: 'item3', 
                	uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"});
            $httpBackend.whenPOST('/ws/rest/v1/item').
            respond({ name: 'item4', 
                	uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"});
            $httpBackend.whenPOST('/ws/rest/v1/item/6g65dc56-72ec-4ab5-9fa8-d98be91adb5b').
            respond({ name: 'item5', 
                	uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"});
            $httpBackend.whenDELETE('/ws/rest/v1/item/6g65dc56-72ec-4ab5-9fa8-d98be91adb5b').
            respond({message: 'Item deleted'});
            
            openmrsRest.listFull('item').then(function(resp){
            	list = resp;
            });
            openmrsRest.get('item', {uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"}).then(function(resp){
            	item = resp;
            });
            var newItem = angular.toJson({name:'item4',uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"});
            openmrsRest.create('item', newItem).then(function(resp){
            	POSTitem = resp;
            });
            var updatedItem = angular.toJson({name:'item5',uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"})
            openmrsRest.update('item',{uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"}, updatedItem).then(function(resp){
            	UPDATEitem = resp;
            });
            openmrsRest.remove('item',{uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"}).then(function(resp){
            	DELETEitem = resp;
            });
            
            $httpBackend.flush();
        }));
        
        it('should load items list', function(){
        	expect(list.results).toEqualData([{ name: 'item1',  
				            					uuid: "2b22dc27-72ec-4ab5-9fa8-d98be91adc1c"},
				            				  { name: 'item2', 
				            					uuid: "3g65dc27-72ec-4ab5-9fa8-d98be91adb5b"},
				            					{ name: 'item3', 
				                				uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"}]
				            				);
        });
        
        it('should load item3', function(){
        	expect(item).toEqualData({ name: 'item3', 
        								uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"});	
        });
        it('should create item4', function(){
        	expect(POSTitem).toEqualData({ name: 'item4', 
        								uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"});	
        });
        it('should update item4', function(){
        	expect(UPDATEitem).toEqualData({ name: 'item5', 
        								uuid: "6g65dc56-72ec-4ab5-9fa8-d98be91adb5b"});	
        });
        it('should delete item4', function(){
        	expect(DELETEitem.message).toEqualData('Item deleted');	
        });

    });
});
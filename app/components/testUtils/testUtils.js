function getLocationMock (){
	var $locationMock = jasmine.createSpyObj('$location', ['path', 'search']);
	$locationMock.path.and.returnValue($locationMock);
	$locationMock.search.and.returnValue($locationMock);
	return $locationMock;
};
function getNotificationMock (){
	var notificationMock = jasmine.createSpyObj('openmrsNotification', ['success','error', 'routeNotification'])
	notificationMock.success.and.returnValue("success toast message");
	notificationMock.error.and.returnValue("error toast message");
	notificationMock.routeNotification.and.returnValue("toast messages from $routeParams");
	return notificationMock;
};

export default {
	getLocationMock : getLocationMock,
	getNotificationMock : getNotificationMock
};
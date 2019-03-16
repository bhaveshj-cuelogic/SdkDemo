# This package contains loner sos alert functionality

Example:-  
1. Import library in your .js file
import Emergency from 'npm-hello-loner'

2. Create instance 

constructor(props) {
super(props)
ObjEmergency = new Emergency();
}

3. Call below function with required parameter,

ObjEmergency.callPostApi("URL", "device_id", "date", "AlertType")
.then(response => {
console.log(">>>>>>", response);
if (response.ok) {
Alert.alert("success", JSON.stringify(response));
}
else {

Alert.alert("Error alert ", response._bodyText.error);
}
})
.catch((error) => {
Alert.alert("Error alert ", error);
}); 








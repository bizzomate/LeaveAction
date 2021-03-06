# LeaveAction

This widget allows you to configure a microflow to be executed when the user exits the page in a non intended manner. E.g. by using the navigation or by closing the tab/browser.
 
##Features and limitations
* Allows a microflow to be executed when the user exits the page
* Possible to show a confirmation dialog when the user closes the browser tab
* Possible to specify which items that result in navigation should be excluded (default: .mx-dataview-controls .mx-button)
* Once the exclude is triggered by a button click, the widget will not do anything. So ensure that the exclude setting only triggers for buttons that have their own close page behaviour. 


##Dependencies
* Build and tested using Mendix 7.5.0

## Contributing

Want to contribute to this widget, submit a feature request or report a bug? Please use the [GitHub repository](https://github.com/bizzomate/LeaveAction)!

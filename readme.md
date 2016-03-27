# mkgUp Alpha
------

it's a basic jquery plugin how improve user interaction for mobile and web UI.


## Main Actions
- **highlight**: to highlight target content
- **scroll**: to smooth scroll target content. it usable with other actions
- **loading**: to coverup the target content area which waiting for ajax request
- **coverBack**: purpose of highlight to target content, coverup back stage
- **disable**: to coverup target area for be unaccessable by user
- **tip**: additional inform tooltip for the target area. it usable with other actions

# Quick Start
Get the latest [release]() of mkgUp  and import the stylesheet to head of the page

```
<link rel="stylesheet" href="mkgUp/mkgUp.min.css" />
```

Put the script right after jQuery:
```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
<script src="mkgUp/mkgUp.min.js"></script>
```

then just call plugin function with `mkgUp()`:
```
$('#targetDiv').mkgUp();

$('#targetDiv').mkgUp('This is Highlighted Content!!!');

$('#targetDiv').mkgUp('disable',{scroll:true});

$('#targetDiv').mkgUp('loading','Please wait until ajax request complete...',{color:'#006FA0'},function(){ alert('loading mask complete') });

$('#targetDiv').mkgUp('scroll');//maybe u just want to scroll
```

### Simple Usage
> **.mkgUp(action)**
> -----
> action: string //highlight, coverBack, loading, disable, tip

### With options and shorthand callback
> **.mkgUp(action, {options}, callback)**
> -----
> action: string //highlight, coverBack, loading, disable, tip
> options: javascript object. every action has difirent properties
> callback: Function
 
### Additional tooltip styled inform text
> **.mkgUp(tipText, action, {options}, callback)**
> -----
> tipText: string
> action: string //highlight, coverBack, loading, disable, tip
> options: javascript object. every action has difirent properties
> callback: Function

# Documentation
_preparing_

# Documentation
_preparing_

# License
The code and the documentation are released under the MIT License.
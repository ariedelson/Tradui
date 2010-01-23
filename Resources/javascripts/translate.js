var translateTo = "English to Creole";
var translateButton;
var searchField;
var platformId;

function buildDatabase() {
  var db = Titanium.Database.install('db/dictionary.db','db');
  Titanium.App.Properties.setBool("dbInstalled",true);
}

function buildTranslation() {
  var sentence = Titanium.App.Properties.getString("sentence");
  Titanium.API.info(translateTo);
  $("#translate"+platformId).html("");
  var wordsArray = sentence.split(" ");
  var db = Titanium.Database.open('db');
  var rows;
  if(wordsArray.length > 0) {
    for(var index in wordsArray) {
      if(wordsArray[index] != '') {
        $("#translate"+platformId).append("<strong>"+wordsArray[index].toLowerCase()+"</strong>");
        if(translateTo != null && translateTo == 'Creole to English') {
          rows = db.execute("SELECT DISTINCT english FROM dictionary WHERE creole = '"+wordsArray[index].toLowerCase()+"' AND english != '' ORDER BY english ASC");
        } else {
          rows = db.execute("SELECT DISTINCT creole FROM dictionary WHERE english = '"+wordsArray[index].toLowerCase()+"' AND creole != '' ORDER BY english ASC ");
        }
        if(rows != null && rows.getRowCount() > 0) {
        	while (rows.isValidRow()) {
            $("#translate"+platformId).append("<li style='margin-left:16px;'>"+rows.field(0)+"</li>");
        		rows.next();
        	}
        } else {
          $("#translate"+platformId).append("<li style='margin-left:16px;'>No matches</li>");
        }
        rows.close();        
      }
    }
  }
  db.close();
}

function buildFormElements() {
  var height = (Titanium.Platform.name.indexOf('iPhone') != -1) ? 30: 40;
	searchField = Titanium.UI.createTextField({
		id:'searchField'+platformId,
		value:'',
		keyboardType:Titanium.UI.KEYBOARD_ASCII,
		hintText:'What word do you want to translate?',
		autocorrect:false,
		width:((Titanium.Platform.name == 'android') ? 306 : 278),
		fontSize:16,
		color:'#222',
		height:height,
		clearOnEdit:false,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_NEVER
	});

  translateButton = Titanium.UI.createButton({
  	id:'translateButton'+platformId,
  	title:'Translate',
  	color:'#ffffff',
  	backgroundImage:'/images/BUTT_drk_off.png',
  	backgroundSelectedImage:'/images/BUTT_drk_on.png',
  	backgroundFocusedImage:'/images/BUTT_drk_on.png',
  	height:57,
  	width:300,
  	fontSize:16,
  	fontWeight:'bold'
  });
  
  translateButton.addEventListener("click",function(e) {
    if(Titanium.Platform.name != 'android') { translateTo = $("select#selectBox"+platformId).val(); }
    Titanium.App.Properties.setString("sentence",searchField.value);
    buildTranslation();
    searchField.blur();
  }); 
}

window.onload = function() {
  if(Titanium.Platform.name == 'android') {
    $("#android").show();
    platformId = "Android";
  } else {
    $("#iphone").show();
    platformId = "iPhone";
  }
  
  if(Titanium.Platform.name != 'android') {
    var infoButton = Titanium.UI.createButton({ systemButton:Titanium.UI.iPhone.SystemButton.INFO_LIGHT });
    infoButton.addEventListener("click", function(){
      var win = Titanium.UI.createWindow({url:'/about.html', title:"About", backgroundImage:'../images/tradui_about_screen.png'});
      win.open({modal:true});
    });
  	Titanium.UI.currentWindow.setRightNavButton(infoButton);
  }

  buildFormElements();
  searchField.blur();
  
  if(Titanium.App.Properties.getBool("dbInstalled") == null || Titanium.App.Properties.getBool("dbInstalled") == 0) {
    buildDatabase();
  }

  if(Titanium.Platform.name == 'android') {
    var menu = Titanium.UI.createMenu();
  	menu.addItem("English To Creole", function() {
      translateTo = "English to Creole";
      $("#translatingHelper"+platformId).html("Translating English to Creole");
  		} , null);
  	menu.addItem("Creole To English", function() {
      translateTo = "Creole to English";
      $("#translatingHelper"+platformId).html("Translating Creole to English");
  		}, null);
  	menu.addItem("About Tradui", function() {
      var win = Titanium.UI.createWindow({url:'/about.html', title:"About", backgroundImage:'../images/tradui_load_screen.png'});
      win.open({animated:true});
  		}, null);
  	Titanium.UI.setMenu(menu);
  }
  
  Titanium.UI.currentWindow.addEventListener('focused',function(e) {
		setTimeout(function(){
      Titanium.UI.currentWindow.setTitle("Tradui");
		},400);
	});
}

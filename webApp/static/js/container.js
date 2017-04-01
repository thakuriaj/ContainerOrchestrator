var arrButtons = [{"Display_Text":"Home","URL":"http://localhost/index",},{"Display_Text":"Image","URL":"http://localhost/images"},{"Display_Text":"Container","URL":"http://localhost/containers"}];
var imageSource = [{"Display_Text":"Home", "src":"<i class='fa fa-home' aria-hidden='true' style='font-size:35px'></i>"},{"Display_Text":"Image","src":"<i class='fa fa-picture-o' aria-hidden='true' style='font-size:35px'></i>"},{"Display_Text":"Container","src":"<i class='fa fa-sellsy' aria-hidden='true' style='font-size:35px'></i>"}]
var containerSource =[{"Display_Text":"Create"},{"Display_Text":"Start"},{"Display_Text":"Stop"},{"Display_Text":"Remove"}];
$(document).ready(function() {
  var tbl = "<table>";
  var tr = "<tr>";
  for (var i=0;i<arrButtons.length;i++) {
    var url = arrButtons[i].URL;
    //alert(url);
    //var td = "<td style='padding:4px;'><input type='button' value='" + arrButtons[i].Display_Text + "' onclick=goto('" +url + "');  /></td>"  ;
    var td = "<td style='padding:4px;'><input class='menu_buttons textbox' type='button' value='" + arrButtons[i].Display_Text + "'  /><span style='display:none;'>" +url + "</span> </td>"  ;
    //var myDiv = "<div style='background-color:" + color + "'>" + url  + "</div>"
    tr = tr + td;
  }
  tr= tr + "</tr>";
  tbl = tbl +  tr + "</table>";
  $("#dvMenuBar").html(tbl);
  tbl = "";
  tr = "";
  tbl = "<table>";
  tr = "<tr>";
  for(var j=0;j<containerSource.length;j++) {
    var td = "<td style='padding:4px;'><input class='containerBtn containerBtns container_btn_click' type='button' value='" + containerSource[j].Display_Text + "'  /></td>" ;
    tr = tr + td;
    //alert(containerSource[j].Display_Text);
  }
  tr = tr + "</tr>";
  tbl = tbl + tr + "</table>";
  $("#container_menu").html(tbl);
});

$(document).on("mouseover",".menu_buttons",function() {
  var btn_offset = $(this).offset();
  //alert(btn_offset.left);
  //alert(btn_offset.top);
  var src;
  var imgKey = $(this).val();
  for(var i=0;i<imageSource.length;i++) {
    //alert(imageSource[i].Display_Text);
    if(imgKey == imageSource[i].Display_Text) {
      src = imageSource[i].src;
      //alert(src);
      break;
    }
  }
  $("#menu_img_icon").parent().css({position:'relative'});
  $("#menu_img_icon").css({top: (btn_offset.top)- (1.4*btn_offset.top), left: btn_offset.left + 80, position:'absolute'});
  //var img = "<img class='img_style' src='" + src + "' ></img>";
  var img = src
  $("#menu_img_icon").html(img);
  //$("#dvMenuBar").append(img);
})
$(document).on("mouseleave",".menu_buttons",function() {
  $("#menu_img_icon").html("");
})
function goto(url) {
  window.location.href = url;
//alert(url);
}
$(document).on("click", ".menu_buttons", function() {
  var $td = $(this).parent("td");
  var $span = $td.children("span");
  window.location.href = $span.text();
})

$(document).on("click", ".container_btn_click", function () {
    var btnVal = $(this).val();
    var containerForm = $('#container_list').css('display');
    var containerId = [];
    if (btnVal == "Create") {
      var disProp = $("#create_container").css("display");
      if (disProp == "none") {
        //alert("Entered");
        disProp = "block";
        //alert(disProp);
        $("#create_container").css("display", disProp);
        $("#container_list").css("display", "none");
      }
      else {
        $("#create_container").css("display", "none");
        $("#container_list").css("display", "block");
      }
    }
    else if (btnVal == "Stop" || btnVal == "Start") {
        var tableRow = $('#tbl_container tr').length-1;
        for(var i=0;i<tableRow;i++)
        {
            var containerrow = $('#tbl_container').find("tr").eq(i + 1).html();
            if ((i) < tableRow)
            {
                var checked = $('#containercheckBox' + (i + 1)).is(':checked');
                console.log(checked);
                if (checked == true)
                {
                  console.log(($('#con_list' + (i + 1)).find('td:eq(2)').html()));
                  containerId.push($('#con_list' + (i + 1)).find('td:eq(2)').html());
                }
            }
        }
        console.log(containerId);
        var status_ContainerIds = btnVal + ',';
        for (var i = 0; i < containerId.length; i++) {
            if (i == containerId.length - 1) {
                var container = containerId[i];
            }
            else {
                var container = containerId[i] + ',';
            }
            var status_ContainerIds = status_ContainerIds.concat(container);
        }
        $.ajax({
            type: 'POST',
            url: '/containers',
            data: { status_ContainerIds },                  //Sending the string as Status,ContainerID. Ex: "Stop,Container1,Container2". Use ',' to split the string in python.
            success: function () {
                alert("Containers " + btnVal);
            },
            error: function () {
                alert("Containers didn't " + btnVal);
            }
        });
    }

    else {
        if (btnVal == 'Remove') {
            var containerCreator = [];
            var tableRow = $('#tbl_container tr').length - 1;
            for (var i = 0; i < tableRow; i++) {
                var containerrow = $('#tbl_container').find("tr").eq(i + 1).html();
                if ((i) < tableRow) {
                    var checked = $('#containercheckBox' + (i + 1)).is(':checked');
                    if (checked == true) {
                        containerId.push($('#con_list' + (i + 1)).find('td:eq(2)').html());
                        containerCreator.push($('#con_list' + (i + 1)).find('td:eq(4)').html());
                        var status = ($('#con_list' + (i + 1)).find('td:eq(3)').html());
                        if (status == "Running") {
                            var running = status;
                        }
                    }
                }
            }
            if (running == 'Running') {
                alert("Container is Running. Needs to be stopped before removing.");
            }
            var status_ContainerIds = btnVal + ',';
            for (var i = 0; i < containerId.length; i++) {
                if (i == containerId.length - 1) {
                    var container = containerId[i];
                }
                else {
                    var container = containerId[i] + ',';
                }
                var status_ContainerIds = status_ContainerIds.concat(container);
                var status_remove = status_remove.concat(container);
            }

            $.ajax(         //Ajax call to the database to check if the person who clicked remove is the one that created the container.
            {
                type: 'GET',
                url: '/temp', //Need for url for the php script
                data: { status_remove },
                datatype: 'text/plain',
                success: function (data) {
                    if (data == success) {
                        $.ajax({                    //this call is to the python script with string" Status,ContainerID(similar to start/ stop)
                            type: 'POST',
                            url: '/container',
                            data: { 'data': status_ContainerIds },
                            success: function () {
                                alert('ContainerRemoved');
                            },
                            error: function () {
                                alert("Container Not Removed 1");
                            }
                        });
                    }
                },
                error: function () {
                    alert("Container not removed 2")
                }
            });
        }
    }
})
      /*var containerId = [];
      var div = '<div>';
      var tableRow = $('#tbl_container tr').length;
      console.log(tableRow);
      //alert(tableRow);
      var checkedItem = 0;
      var temp = "";
      //alert(tableRow);
      for(var i=0;i < tableRow;i++) {
        console.log("looping");
        var containerrow = $('#tbl_container').find("tr").eq(i).html();
        var checked = $('#containercheckBox' + (i)).is(':checked');
        if (checked == true) {
          var temp_status = $('#con_list' + (i)).find('td:eq(3)').html()  //Gives the status
          if (temp_status == status) {
            alert("Container is already " + status);
          }
          checkedItem = checkedItem +1;
          //alert(checked);
          var testing = $('#con_list' + (i)).find('td:eq(2)').html()
          console.log(testing);
          console.log(containerId);
          containerId.push(testing);
          console.log(containerId);
          //temp = $('#con_list' + (i + 1)).find('td:eq(2)').html()         //This gives the containerID Send AJAX call here
          //Get status back
          //$('#con_list' + (i + 1)).find('td:eq(3)').html(status);
          $('#containercheckBox' + (i + 1)).val([]);
          //alert(containerId);
        }
      }
      //console.log(containerId);
    }
})*/

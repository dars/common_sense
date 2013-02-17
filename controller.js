function commonForm($scope)
{
	$scope.things = "";
	$scope.commonThings = [];
	$scope.getLists = function()
	{
	    var msgs = new Message();
        msgs.fetch({
            success: function(model) {
            	var obj = model.toJSON();
            	$.each(obj, function(i, o){
            		o.isDelete = false;
            		var d = new Date(o.createddate);
            		var curr_d = chk0Num(d.getDate());
                    var curr_m = chk0Num(d.getMonth() + 1); //Months are zero based
                    var curr_y = d.getFullYear();
                    var curr_h = chk0Num(d.getHours());
                    var curr_min = chk0Num(d.getMinutes());
                    var curr_dt = curr_y + "-" + curr_m + "-" + curr_d + " " + curr_h + ":" + curr_min;
                    o.timestamp = curr_dt;
            		$scope.commonThings.push(o);
            	});
            	console.debug($scope.commonThings);
            },
            error: function(model, response) {
                console.debug(response);
            }
        });
	}
	$scope.getLists();
	$scope.addThing = function()
	{
		if(this.things){
			var d = new Date();
            var curr_d = chk0Num(d.getDate());
            var curr_m = chk0Num(d.getMonth() + 1); //Months are zero based
            var curr_y = d.getFullYear();
            var curr_h = chk0Num(d.getHours());
            var curr_min = chk0Num(d.getMinutes());
            var curr_dt = curr_y + "-" + curr_m + "-" + curr_d + " " + curr_h + ":" + curr_min;
            console.log(this.commonThings);
			this.commonThings.push({content:this.things,isDelete:false,timestamp:curr_dt});

			var to = new Message({
                content: this.things,
                agree:0,
                disagree:0
            });
            to.create({
                success:function(model) {
                    // Notice how StackMob auto generated a unique primary key for this object instance under "testobject_id".
                    // Schema primary keys are [schema name]_id
                    // If you specified "testobject_id" in your JSON, StackMob will use your given one instead.
                    console.debug(model.toJSON());
                    $(".error").hide();
                    $(".success").show();
                },
                error : function(model, response) {
                    console.debug("Oops there was an error in creating the object.");
                    console.debug("Have you initialized your JS SDK?");
                    console.debug("Are you running this on StackMob's Local Runner?");
                    console.debug("Are you running this on StackMob's GitHub-integrated hosting?")
                    console.debug(response);
                }
            });
            this.things = "";
		}
	}
	$scope.removeThing = function(item)
	{
		item.isDelete = true;
	}
}
function init(){
	var msgs = new Message();
    msgs.fetch({
        success: function(model) {
        	console.debug(model.toJSON());
        },
        error: function(model, response) {
            console.debug(response);
        }
    });
}
function chk0Num(num)
{
	if(num < 10){
		return "0"+num;
	}else{
		return num;
	}
}

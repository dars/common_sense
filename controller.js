function commonForm($scope)
{
    $scope.things = "";
    $scope.commonThings = [];
    $scope.getLists = function()
    {
        var msgs = new Message();
        var q = new StackMob.Collection.Query();
        q.orderDesc('createddate');
        $(".alert").show();
        msgs.query(q, {
            success: function(model) {
                var obj = model.toJSON();
                var res = [];
                $.each(obj, function(i, o){
                    o.isDelete = false;
                    o.timestamp = getDatetime(o.createddate);
                    res.push(o);
                });
                $scope.$apply(function() {
                    $scope.commonThings = res;
                });
                $(".alert").hide();
            },
            error: function(model, response) {
                $(".alert").hide();
            }
        });
    }
    $scope.getLists();
    $scope.addThing = function()
    {
        if(this.things){
            $(".alert").show();
            var to = new Message({
                content: this.things,
                agree:0,
                disagree:0
            });
            to.create({
                success:function(model) {
                    $scope.getLists();
                    console.debug(model.toJSON());
                    $(".alert").hide();
                },
                error : function(model, response) {
                    console.debug("Oops there was an error in creating the object.");
                    console.debug("Have you initialized your JS SDK?");
                    console.debug("Are you running this on StackMob's Local Runner?");
                    console.debug("Are you running this on StackMob's GitHub-integrated hosting?")
                    console.debug(response);
                    $(".alert").hide();
                }
            });
            this.things = "";
        }
    }

    $scope.agree_btn = function(item)
    {
        var query = new Message({message_id:item.message_id, agree:item.agree+1});
        query.save({}, {
            success: function(model) {
                $scope.getLists();
                console.debug(model.toJSON());
            },
            error: function(model, response) {
                console.debug(response);
            }
        });
    }

    $scope.disagree_btn = function(item)
    {
        var query = new Message({message_id:item.message_id, disagree:item.disagree+1});
        query.save({}, {
            success: function(model) {
                $scope.getLists();
                console.debug(model.toJSON());
            },
            error: function(model, response) {
                console.debug(response);
            }
        });
    }

    $scope.removeThing = function(item)
    {
        item.isDelete = true;
    }
}

function getDatetime(utc_sec)
{
    if(utc_sec){
        var d = new Date(utc_sec);
    }else{
        var d = new Date();
    }
    var curr_d = chk0Num(d.getDate());
    var curr_m = chk0Num(d.getMonth() + 1); //Months are zero based
    var curr_y = d.getFullYear();
    var curr_h = chk0Num(d.getHours());
    var curr_min = chk0Num(d.getMinutes());
    var curr_dt = curr_y + "-" + curr_m + "-" + curr_d + " " + curr_h + ":" + curr_min;
    return curr_dt;
}

function chk0Num(num)
{
    if(num < 10){
        return "0"+num;
    }else{
        return num;
    }
}

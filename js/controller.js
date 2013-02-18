var ctrl = angular.module('commonApp', []);

ctrl.controller('commonForm', ['$scope', function ($scope) {
    $scope.things = "";
    $scope.commonThings = [];
    $scope.getLists = function () {
        var msgs = new Message();
        var q = new StackMob.Collection.Query();
        q.orderDesc('createddate');
        $(".alert").show();
        msgs.query(q, {
            success: function (model) {
                var obj = model.toJSON();
                var res = [];
                $.each(obj, function (i, o) {
                    o.isDelete = false;
                    o.timestamp = getDatetime(o.createddate);
                    res.push(o);
                });
                $scope.$apply(function () {
                    $scope.commonThings = res;
                });
                $(".alert").hide();
            },
            error: function (model, response) {
                $(".alert").hide();
            }
        });
    };
    $scope.getLists();
    $scope.addThing = function () {
        if (this.things) {
            $(".alert").show();
            var to = new Message({
                content: this.things,
                agree: 0,
                disagree: 0
            });
            to.create({
                success: function (model) {
                    $scope.getLists();
                    console.debug(model.toJSON());
                    $(".alert").hide();
                },
                error: function (model, response) {
                    console.debug("Oops there was an error in creating the object.");
                    console.debug("Have you initialized your JS SDK?");
                    console.debug("Are you running this on StackMob's Local Runner?");
                    console.debug("Are you running this on StackMob's GitHub-integrated hosting?");
                    console.debug(response);
                    $(".alert").hide();
                }
            });
            this.things = "";
        }
    };

    $scope.agree_btn = function (item) {
        var query = new Message({message_id: item.message_id, agree: item.agree + 1});
        query.save({}, {
            success: function (model) {
                $scope.getLists();
                console.debug(model.toJSON());
            },
            error: function (model, response) {
                console.debug(response);
            }
        });
    };

    $scope.disagree_btn = function (item) {
        var query = new Message({message_id: item.message_id, disagree: item.disagree + 1});
        query.save({}, {
            success: function (model) {
                $scope.getLists();
                console.debug(model.toJSON());
            },
            error: function (model, response) {
                console.debug(response);
            }
        });
    };

    $scope.removeThing = function (item) {
        item.isDelete = true;
    };
}]);

// 改用 moment.js
function getDatetime(utc_sec) {
    if (utc_sec) {
        return moment(utc_sec).format("YYYY-MM-DD HH:mm");
    }
    return moment().format("YYYY-MM-DD HH:mm");
}

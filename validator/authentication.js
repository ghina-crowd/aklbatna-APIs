var countryService=require('../service/users.js');
var validator={
    validateCreqentials:function(creqentials){
        countryService.Create(req.body).then(function(result){
            res.json({status:statics.STATUS_SUCCESS,code:codes.SUCCESS,message:messages.DATA_SAVED,data:null});
        },function(error){
            logger.error(messages.SERVER_ERROR+' '+error)
            res.json({status:statics.STATUS_SUCCESS,code:codes.SUCCESS,message:messages.DATA_NOT_SAVED,data:null});
        });
    }
};

module.exports=validator;

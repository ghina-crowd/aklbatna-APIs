var code={
    SUCCESS:200,  // success
    FAILURE:-1,   // validation error
    INVALID_DATA:-2,
    ACCOUNT_NOT_FOUND:-3,
    ACCOUNT_NOT_ACTIVE:-4,
    TOKEN_MISSING:401  , // Empty token
    TOKEN_INVALID:500// invalid token
};

module.exports=code;
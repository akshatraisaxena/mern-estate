export const eroorHnadler=(stastusCode,message)=>{
    const error = new Error();
    error.stastusCode=stastusCode;
    error.message=message;
    return error;
}
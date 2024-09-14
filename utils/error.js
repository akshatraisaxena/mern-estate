export const errorHnadler=(stastusCode,message)=>{
    const error = new Error();
    error.stastusCode=stastusCode;
    error.message=message;
    return error;
}
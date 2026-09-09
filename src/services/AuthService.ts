const SUPABASE_URL=import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY=import.meta.env.VITE_SUPABASE_KEY;
interface SignupPayload{
   email:string,
    password:string,
    data: {
      name: string,
      department?: string
    };}
interface SignupSuccessResponse {
      access_token: string;
      user: {
                id: string,
        email: string,

      }
}
interface SignupErrorResponse {
    
    code: number,
    error_code: string,
    msg: string,

}
export async function signUp(payload:SignupPayload):Promise<SignupSuccessResponse>{
    const response=await fetch(`${SUPABASE_URL}/auth/v1/signup`,{method:"POST",headers: {
        apikey:SUPABASE_KEY,
        "Content-Type":"application/json"
    }
,body:JSON.stringify(payload)})
const result=await response.json();
if(!response.ok){
    const errordata=result as SignupErrorResponse;
    throw new Error(errordata.msg||"something went wrong please try again");
}
  return result as SignupSuccessResponse;

};
